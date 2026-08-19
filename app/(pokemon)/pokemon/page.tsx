import Loading from '@/components/loading';
import { Suspense } from 'react';
import PokemonDataTable from './pokemon-data-table';
import TodoForm from './pokemon-form';

export default async function Page() {
  return (
    <div className="my-8 flex flex-col gap-4 px-4 md:mx-auto md:flex-row">
      <div className="">
        <TodoForm />
      </div>

      <div className="md:min-w-sm">
        <Suspense fallback={<Loading />}>
          <PokemonDataTable />
        </Suspense>
      </div>
    </div>
  );
}
