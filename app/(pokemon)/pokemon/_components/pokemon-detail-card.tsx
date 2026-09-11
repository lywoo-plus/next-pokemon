'use client';

import { fetchPokemon } from '@/actions/pokemon';
import { QueryState } from '@/components/query-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

export default function PokemonDetailCard({
  pokemonId,
  className,
}: {
  pokemonId: number;
  className?: string;
}) {
  const pokemonQuery = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => fetchPokemon(pokemonId),
    staleTime: 60_000, // cached data be considered fresh for 60 seconds
  });

  return (
    <QueryState
      query={pokemonQuery}
      errorMessage="Failed to fetch Pokemon"
      empty={<p className="text-muted-foreground text-sm">Pokemon not found</p>}
    >
      {(pokemon) => (
        <Card className={cn('w-full md:w-sm', className)}>
          <CardHeader>
            {pokemon.imageUrl && (
              <div className="bg-muted relative aspect-square w-full">
                <Image
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
            )}
            <CardTitle>{pokemon.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground text-sm leading-6">
              {pokemon.description}
            </p>
          </CardContent>
        </Card>
      )}
    </QueryState>
  );
}
