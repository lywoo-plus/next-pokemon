import { listPokemons } from '@/actions/pokemon';
import Image from 'next/image';

export default async function PokemonDataTable() {
  const pokemons = await listPokemons();

  return (
    <ul>
      {pokemons.map((pokemon) => (
        <li
          key={pokemon.id}
          className="grid grid-cols-3 place-content-center gap-4 border p-2"
        >
          <Image
            src={pokemon.imageUrl || '/'}
            width={50}
            height={50}
            alt={pokemon.name}
            className="size-16 object-cover"
          />
          <p>{pokemon.name}</p>
          <p>{pokemon.description}</p>
        </li>
      ))}
    </ul>
  );
}
