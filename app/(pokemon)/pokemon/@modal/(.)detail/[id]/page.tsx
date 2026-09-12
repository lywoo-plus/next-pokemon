import PokemonDetailCard from '@/features/pokemon/components/pokemon-detail-card';
import PokemonDetailDialog from '@/features/pokemon/components/pokemon-detail-dialog';
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

  return (
    <PokemonDetailDialog id={pokemonId}>
      <PokemonDetailCard
        pokemonId={pokemonId}
        className="bg-slate-50 md:w-full"
      />
    </PokemonDetailDialog>
  );
}
