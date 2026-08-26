import { fetchPokemon } from '@/actions/pokemon';
import PokemonDetailDialog from '@/app/(pokemon)/pokemon/_components/pokemon-detail-dialog';
import PokemonForm from '@/app/(pokemon)/pokemon/_components/pokemon-form';
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

  const pokemon = await fetchPokemon(pokemonId);

  if (!pokemon) {
    notFound();
  }

  return (
    <PokemonDetailDialog id={pokemon.id}>
      <PokemonForm value={pokemon} className="bg-slate-50 md:w-full" />
    </PokemonDetailDialog>
  );
}
