import Loading from '@/components/loading';
import { Suspense } from 'react';
import PokemonDataTable from './pokemon-data-table';

export default function Page() {
  return (
    <div className="md:min-w-sm">
      <Suspense fallback={<Loading />}>
        <PokemonDataTable />
      </Suspense>
    </div>
  );
}
