'use client';

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
import { useForm } from '@tanstack/react-form';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  image: z
    .file()
    .refine((file) => file.type.startsWith('image/'), 'Please choose an image')
    .nullable(),
  name: z.string().min(1, 'Please enter a name'),
  description: z.string().min(1, 'Please enter a description'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PokemonForm() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const imagePreviewUrlRef = useRef<string | null>(null);

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
    defaultValues: {
      image: null,
      name: '',
      description: '',
    } as FormValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async (values) => {
      const formValues = values.value;

      // TODO: Simulate API call
      console.log('🪲🪲🪲🪲🪲');
      console.log(formValues);
      console.log('🪲🪲🪲🪲🪲');

      toast.promise(
        new Promise<FormValues>((resolve) => {
          setTimeout(() => resolve(formValues), 1000);
        }),
        {
          position: 'top-center',
          loading: 'Creating pokemon',
          success: (data) => {
            return `${data.name} created`;
          },
          error: 'Error creating pokemon',
        },
      );
    },
  });

  return (
    <Card className="w-sm">
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
                      {imagePreviewUrl ? (
                        <Image
                          src={imagePreviewUrl}
                          alt={
                            selectedImage
                              ? `Preview of ${selectedImage.name}`
                              : 'Selected Pokemon'
                          }
                          fill
                          unoptimized
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
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              updateImagePreview(null);
              setImageInputKey((key) => key + 1);
            }}
          >
            Reset
          </Button>
          <Button type="submit" form="pokemon-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
