import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/db/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const pokemonId = Number(id);

  if (!Number.isInteger(pokemonId)) {
    notFound();
  }

  const pokemon = await prisma.pokemon.findUnique({
    where: {
      id: pokemonId,
    },
  });

  if (!pokemon) {
    notFound();
  }

  return (
    <Card className="w-full md:w-sm">
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
        <CardDescription>Pokemon #{pokemon.id}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm leading-6">
          {pokemon.description}
        </p>
      </CardContent>
    </Card>
  );
}
