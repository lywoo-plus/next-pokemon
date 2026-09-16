'use client';

import { QueryState } from '@/components/query-state';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { runSafeAction } from '@/features/auth/action-result';
import type { Pokemon } from '@/lib/generated/prisma/browser';
import { cn } from '@/lib/utils';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  createPokemon,
  createPresignedS3UploadUrl,
  findPokemon,
  updatePokemon,
} from '../actions';
import {
  pokemonFormSchema,
  type PokemonFormValues,
  updatePokemonFormSchema,
} from '../schemas';

function getPokemonFormValues(pokemon?: Pokemon): PokemonFormValues {
  return {
    image: null,
    name: pokemon?.name ?? '',
    description: pokemon?.description ?? '',
  };
}

export default function PokemonForm({
  pokemonId,
  className,
}: {
  pokemonId?: number;
  className?: string;
}) {
  const pokemonQuery = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => runSafeAction(findPokemon, pokemonId!),
    enabled: pokemonId != null,
  });

  if (pokemonId == null) {
    return <PokemonFormFields className={className} />;
  }

  return (
    <QueryState
      query={pokemonQuery}
      errorMessage="Failed to fetch Pokemon"
      empty={<p className="text-muted-foreground text-sm">Pokemon not found</p>}
    >
      {(pokemon) => <PokemonFormFields value={pokemon} className={className} />}
    </QueryState>
  );
}

function PokemonFormFields({
  value,
  className,
}: {
  value?: Pokemon;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const imagePreviewUrlRef = useRef<string | null>(null);
  const existingImageUrl = value?.imageUrl ?? null;
  const defaultFormValues = useMemo(() => getPokemonFormValues(value), [value]);
  const submitValidator = value ? updatePokemonFormSchema : pokemonFormSchema;

  const savePokemonMutation = useMutation({
    mutationFn: async (formValues: PokemonFormValues) => {
      const image = formValues.image;
      let imageUrl: string | undefined;

      if (image) {
        const { uploadUrl, publicUrl } = await runSafeAction(
          createPresignedS3UploadUrl,
          {
            fileName: image.name,
            fileType: image.type,
          },
        );

        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: image,
          headers: {
            'Content-Type': image.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        imageUrl = publicUrl;
      }

      if (value) {
        return runSafeAction(updatePokemon, {
          id: value.id,
          ...(imageUrl ? { imageUrl } : {}),
          name: formValues.name,
          description: formValues.description,
        });
      }

      if (!imageUrl) {
        throw new Error('Please choose an image');
      }

      return runSafeAction(createPokemon, {
        imageUrl,
        name: formValues.name,
        description: formValues.description,
      });
    },
    onSuccess: async (savedPokemon) => {
      resetForm();

      await queryClient.invalidateQueries({ queryKey: ['pokemons'] });

      if (value) {
        await queryClient.invalidateQueries({
          queryKey: ['pokemon', savedPokemon.id],
        });
      }
    },
  });

  const updateImagePreview = useCallback((file: File | null) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }

    if (!file) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    imagePreviewUrlRef.current = previewUrl;
    setImagePreviewUrl(previewUrl);
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const form = useForm({
    defaultValues: defaultFormValues,
    validators: {
      onSubmit: submitValidator as never,
    },
    onSubmit: async (values) => {
      const formValues = values.value;

      const submitPromise = savePokemonMutation.mutateAsync(formValues);

      toast.promise(submitPromise, {
        position: 'top-center',
        loading: 'Collecting Pokemon...',
        success: (data) => {
          return `Pokemon: ${data.name} ${value ? 'updated' : 'created'}`;
        },
        error: (e) => `Something went wrong ${e.message}`,
      });

      await submitPromise;
    },
  });

  const resetForm = useCallback(() => {
    form.reset(defaultFormValues);
    updateImagePreview(null);
    setImageInputKey((key) => key + 1);
  }, [defaultFormValues, form, updateImagePreview]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <Card className={cn('md:w-sm', className)}>
      <CardHeader>
        <CardTitle>Pokemon</CardTitle>
        <CardDescription>Who&apos;s that Pokemon?</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="pokemon-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="image">
              {(field) => {
                const selectedImage = field.state.value;
                const displayedImageUrl = imagePreviewUrl ?? existingImageUrl;
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={`${field.name}-input`}>
                      Image
                    </FieldLabel>
                    <label
                      htmlFor={`${field.name}-input`}
                      className="group border-input bg-muted/30 hover:bg-muted/50 has-[input:focus-visible]:ring-ring/50 relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed transition-colors group-data-[invalid=true]:ring-3"
                    >
                      {displayedImageUrl ? (
                        <Image
                          src={displayedImageUrl}
                          alt={
                            selectedImage
                              ? `Preview of ${selectedImage.name}`
                              : value?.name
                                ? value.name
                                : 'Selected Pokemon'
                          }
                          fill
                          unoptimized={Boolean(imagePreviewUrl)}
                          sizes="(max-width: 640px) 100vw, 384px"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                          <span className="border-border bg-background grid size-10 place-items-center rounded-lg border shadow-xs">
                            <ImagePlusIcon className="size-5" />
                          </span>
                          <span className="text-sm font-medium">
                            Choose image
                          </span>
                        </div>
                      )}

                      <input
                        key={imageInputKey}
                        id={`${field.name}-input`}
                        name={field.name}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          field.handleChange(file);
                          updateImagePreview(file);
                        }}
                      />
                    </label>

                    {selectedImage && (
                      <div className="border-border bg-muted/30 flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-sm">
                        <span className="text-muted-foreground truncate">
                          {selectedImage.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Remove image"
                          onClick={() => {
                            field.handleChange(null);
                            updateImagePreview(null);
                            setImageInputKey((key) => key + 1);
                          }}
                        >
                          <XIcon />
                        </Button>
                      </div>
                    )}

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Pokemon name"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Pokemon description"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" form="pokemon-form" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </form.Subscribe>
        </Field>
      </CardFooter>
    </Card>
  );
}
