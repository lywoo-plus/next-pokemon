import * as z from 'zod';

const pokemonTextFieldsSchema = z.object({
  name: z.string().min(1, 'Please enter a name'),
  description: z.string().min(1, 'Please enter a description'),
});

export const pokemonFormSchema = pokemonTextFieldsSchema.extend({
  image: z
    .file()
    .refine((file) => file.type.startsWith('image/'), 'Please choose an image')
    .nullable(),
});

export const addPokemonSchema = pokemonTextFieldsSchema
  .extend({
    imageUrl: z.string().min(1, 'Please choose an image'),
  })
  .strict();

export const updatePokemonSchema = pokemonTextFieldsSchema
  .extend({
    imageUrl: z.string().min(1, 'Please choose an image').optional(),
  })
  .strict();

export type PokemonFormValues = z.infer<typeof pokemonFormSchema>;
export type AddPokemonInput = z.infer<typeof addPokemonSchema>;
export type UpdatePokemonInput = z.infer<typeof updatePokemonSchema>;
