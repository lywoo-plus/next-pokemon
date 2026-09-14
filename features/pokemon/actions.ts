'use server';

import { createPresignedS3UploadUrlData } from '@/integrations/s3';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { protectedActionClient } from '../auth/safe-action';
import { createPokemonRecord, updatePokemonRecord } from './mutations';
import { findPokemonRecordById, listPokemonRecords } from './queries';
import {
  addPokemonSchema,
  pokemonIdSchema,
  updatePokemonActionSchema,
} from './schemas';
import { removePokemon } from './services';

const presignedS3UploadUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().startsWith('image/', 'Only image uploads are allowed'),
});

export const createPokemon = protectedActionClient
  .inputSchema(addPokemonSchema)
  .action(async ({ parsedInput }) => {
    const pokemon = await createPokemonRecord(parsedInput);

    revalidatePath('/pokemon');

    return pokemon;
  });

export const findPokemon = protectedActionClient
  .inputSchema(pokemonIdSchema)
  .action(async ({ parsedInput }) => {
    return findPokemonRecordById(parsedInput);
  });

export const updatePokemon = protectedActionClient
  .inputSchema(updatePokemonActionSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...input } = parsedInput;
    const pokemon = await updatePokemonRecord(id, input);

    revalidatePath('/pokemon');
    revalidatePath(`/pokemon/detail/${id}`);

    return pokemon;
  });

export const listPokemons = protectedActionClient.action(async () => {
  return listPokemonRecords();
});

export const deletePokemon = protectedActionClient
  .inputSchema(pokemonIdSchema)
  .action(async ({ parsedInput }) => {
    const pokemon = await removePokemon(parsedInput);

    revalidatePath('/pokemon');

    return pokemon;
  });

export const createPresignedS3UploadUrl = protectedActionClient
  .inputSchema(presignedS3UploadUrlSchema)
  .action(async ({ parsedInput }) => {
    return createPresignedS3UploadUrlData(parsedInput);
  });
