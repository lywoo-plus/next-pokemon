import PokemonDetailCard from '@/features/pokemon/components/pokemon-detail-card';
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

  return <PokemonDetailCard pokemonId={pokemonId} />;
}
