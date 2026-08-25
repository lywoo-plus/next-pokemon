import { fetchPokemon } from '@/actions/pokemon';
import { notFound } from 'next/navigation';
import PokemonDetailDialog from './pokemon-detail-dialog';

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

  return <PokemonDetailDialog pokemon={pokemon} />;
}
