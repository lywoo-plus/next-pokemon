import { listPokemons } from '@/actions/pokemon';
import { PokemonTable } from './pokemon-table';

export default async function PokemonDataTable() {
  const pokemons = await listPokemons();

  return <PokemonTable pokemons={pokemons} />;
}
