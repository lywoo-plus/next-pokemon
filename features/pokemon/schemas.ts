import * as z from 'zod';

export const pokemonIdSchema = z.number().int().positive();

const pokemonTextFieldsSchema = z.object({
  name: z.string().min(1, 'Please enter a name'),
  description: z.string().min(1, 'Please enter a description'),
});

const pokemonImageSchema = z
  .file('Please choose an image')
  .refine((file) => file.type.startsWith('image/'), 'Please choose an image');

const requiredPokemonImageSchema = z
  .union([pokemonImageSchema, z.null()])
  .refine((file): file is File => file != null, 'Please choose an image');

export const pokemonFormSchema = pokemonTextFieldsSchema.extend({
  image: requiredPokemonImageSchema,
});

export const updatePokemonFormSchema = pokemonTextFieldsSchema.extend({
  image: pokemonImageSchema.nullable(),
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

export const updatePokemonActionSchema = updatePokemonSchema.extend({
  id: pokemonIdSchema,
});

export type PokemonFormValues = z.infer<typeof updatePokemonFormSchema>;
export type AddPokemonInput = z.infer<typeof addPokemonSchema>;
export type UpdatePokemonInput = z.infer<typeof updatePokemonSchema>;
