'use client';

import Loading from '@/components/loading';
import type { UseQueryResult } from '@tanstack/react-query';

export function QueryState<TData>({
  query,
  children,
  empty = null,
  errorMessage = 'Failed to fetch data',
}: {
  query: UseQueryResult<TData>;
  children: (data: NonNullable<TData>) => React.ReactNode;
  empty?: React.ReactNode;
  errorMessage?: string;
}) {
  if (query.isPending) {
    return <Loading />;
  }

  if (query.error) {
    return (
      <p className="text-destructive text-sm">
        {query.error instanceof Error ? query.error.message : errorMessage}
      </p>
    );
  }

  if (query.data == null) {
    return empty;
  }

  return children(query.data);
}
