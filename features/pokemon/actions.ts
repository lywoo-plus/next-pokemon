'use server';

import { revalidatePath } from 'next/cache';
import { createPokemonRecord, updatePokemonRecord } from './mutations';
import { findPokemonRecordById, listPokemonRecords } from './queries';
import { type AddPokemonInput, type UpdatePokemonInput } from './schemas';
import { removePokemon } from './services';

export async function createPokemon(input: AddPokemonInput) {
  const pokemon = await createPokemonRecord(input);

  revalidatePath('/pokemon');

  return pokemon;
}

export async function findPokemon(id: number) {
  return findPokemonRecordById(id);
}

export async function updatePokemon(id: number, input: UpdatePokemonInput) {
  const pokemon = await updatePokemonRecord(id, input);

  revalidatePath('/pokemon');
  revalidatePath(`/pokemon/detail/${id}`);

  return pokemon;
}

export async function listPokemons() {
  return listPokemonRecords();
}

export async function deletePokemon(id: number) {
  const pokemon = await removePokemon(id);

  revalidatePath('/pokemon');

  return pokemon;
}
