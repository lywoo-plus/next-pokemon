'use client';

import { QueryState } from '@/components/query-state';
import { useQuery } from '@tanstack/react-query';
import { listPokemons } from '../actions';
import { PokemonTable } from './pokemon-table';

export default function PokemonDataTable() {
  const pokemonQuery = useQuery({
    queryKey: ['pokemons'],
    queryFn: listPokemons,
    staleTime: 60 * 1000,
  });

  return (
    <QueryState query={pokemonQuery} errorMessage="Failed to fetch Pokemon">
      {(pokemons) => <PokemonTable pokemons={pokemons} />}
    </QueryState>
  );
}
