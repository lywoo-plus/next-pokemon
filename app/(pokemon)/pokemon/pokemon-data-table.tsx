import { listPokemons } from '@/actions/pokemon';
import { DataTable } from '../../../components/data-table';
import { columns } from './columns';

export default async function PokemonDataTable() {
  const pokemons = await listPokemons();

  return <DataTable columns={columns} data={pokemons} />;
}
