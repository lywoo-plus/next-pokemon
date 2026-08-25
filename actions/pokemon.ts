'use server';

import { deleteS3ObjectByPublicUrl } from '@/actions/s3';
import { prisma } from '@/db/prisma';
import {
  addPokemonSchema,
  type AddPokemonInput,
} from '@/lib/validations/pokemon';
import { revalidatePath } from 'next/cache';

export async function addPokemon(input: AddPokemonInput) {
  const data = addPokemonSchema.parse(input);

  const pokemon = await prisma.pokemon.create({ data });

  revalidatePath('/pokemon');

  return pokemon;
}

export async function fetchPokemon(id: number) {
  return await prisma.pokemon.findUnique({
    where: {
      id,
    },
  });
}

export async function listPokemons() {
  return await prisma.pokemon.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function deletePokemon(id: number) {
  const pokemon = await prisma.pokemon.delete({
    where: {
      id,
    },
  });

  if (pokemon.imageUrl) {
    await deleteS3ObjectByPublicUrl(pokemon.imageUrl);
  }

  revalidatePath('/pokemon');

  return pokemon;
}
