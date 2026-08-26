import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pokemon } from '@/lib/generated/prisma/browser';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function PokemonDetailCard({
  pokemon,
  className,
}: {
  pokemon: Pokemon;
  className?: string;
}) {
  return (
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
  );
}
