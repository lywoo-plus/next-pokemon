import 'server-only';

import { prisma } from '@/db/prisma';

export async function findPokemonRecordById(id: number) {
  return prisma.pokemon.findUnique({
    where: {
      id,
    },
  });
}

export async function listPokemonRecords() {
  await new Promise((resolve) => {
    setTimeout(() => resolve(null), 50);
  });

  return prisma.pokemon.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
