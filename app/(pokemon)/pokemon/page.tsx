import { Suspense } from 'react';
import PokemonDataTable from './pokemon-data-table';
import TodoForm from './pokemon-form';

export default async function Page() {
  return (
    <div className="mx-auto my-8 flex gap-4">
      <TodoForm />

      <div className="rounded-md border md:w-sm">
        <Suspense fallback={<p>Loading...</p>}>
          <PokemonDataTable />
        </Suspense>
      </div>
    </div>
  );
}
