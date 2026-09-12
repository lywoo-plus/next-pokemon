import PokemonDetailDialog from '@/features/pokemon/components/pokemon-detail-dialog';
import PokemonForm from '@/features/pokemon/components/pokemon-form';
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
      <PokemonForm pokemonId={pokemonId} className="bg-slate-50 md:w-full" />
    </PokemonDetailDialog>
  );
}
