import { notFound } from 'next/navigation';
import PokemonDetailCard from '../../../_components/pokemon-detail-card';
import PokemonDetailDialog from '../../../_components/pokemon-detail-dialog';

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
