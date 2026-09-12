import 'server-only';

import { prisma } from '@/db/prisma';
import {
  addPokemonSchema,
  updatePokemonSchema,
  type AddPokemonInput,
  type UpdatePokemonInput,
} from './schemas';

export async function createPokemonRecord(input: AddPokemonInput) {
  const data = addPokemonSchema.parse(input);

  return prisma.pokemon.create({ data });
}

export async function updatePokemonRecord(
  id: number,
  input: UpdatePokemonInput,
) {
  const data = updatePokemonSchema.parse(input);

  return prisma.pokemon.update({
    where: {
      id,
    },
    data,
  });
}

export async function deletePokemonRecord(id: number) {
  return prisma.pokemon.delete({
    where: {
      id,
    },
  });
}
