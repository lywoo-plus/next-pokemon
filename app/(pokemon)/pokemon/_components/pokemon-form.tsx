'use client';

import { addPokemon, updatePokemon } from '@/actions/pokemon';
import { createPresignedS3UploadUrl } from '@/actions/s3';
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
import type { Pokemon } from '@/lib/generated/prisma/browser';
import {
  pokemonFormSchema,
  type PokemonFormValues,
} from '@/lib/validations/pokemon';
import { useForm } from '@tanstack/react-form';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function getPokemonFormValues(pokemon?: Pokemon): PokemonFormValues {
  return {
    image: null,
    name: pokemon?.name ?? '',
    description: pokemon?.description ?? '',
  };
}

export default function PokemonForm({ value }: { value?: Pokemon }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const imagePreviewUrlRef = useRef<string | null>(null);
  const existingImageUrl = value?.imageUrl ?? null;

  function updateImagePreview(file: File | null) {
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
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const form = useForm({
    defaultValues: getPokemonFormValues(value),
    validators: {
      onSubmit: pokemonFormSchema,
    },
    onSubmit: async (values) => {
      const formValues = values.value;
      const image = formValues.image;

      if (!image && !value) {
        toast.error('Please choose an image', {
          position: 'top-center',
        });
        return;
      }

      const submitPromise = (async () => {
        let imageUrl: string | undefined;

        if (image) {
          const { uploadUrl, publicUrl } = await createPresignedS3UploadUrl({
            fileName: image.name,
            fileType: image.type,
          });

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
          return updatePokemon(value.id, {
            ...(imageUrl ? { imageUrl } : {}),
            name: formValues.name,
            description: formValues.description,
          });
        }

        return addPokemon({
          imageUrl: imageUrl!,
          name: formValues.name,
          description: formValues.description,
        });
      })(); // Start async work of submitting

      toast.promise(
        submitPromise, // Watch the async work of submitting
        {
          position: 'top-center',
          loading: 'Collecting Pokemon...',
          success: (data) => {
            resetForm();
            return `Pokemon: ${data.name} ${value ? 'updated' : 'created'}`;
          },
          error: (e) => `Something went wrong ${e.message}`,
        },
      );

      await submitPromise; // Watch the async work of submitting
    },
  });

  function resetForm() {
    form.reset(getPokemonFormValues(value));
    updateImagePreview(null);
    setImageInputKey((key) => key + 1);
  }

  useEffect(() => {
    resetForm();
  }, [value?.id]);

  return (
    <Card className="md:w-sm">
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
