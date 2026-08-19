'use server';

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

export async function listPokemons() {
  await new Promise((resolve) => {
    setTimeout(() => resolve(null), 1000);
  });
  return prisma.pokemon.findMany();
}
