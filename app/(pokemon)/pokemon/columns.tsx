'use client';

import { DataTableFeatures } from '@/components/data-table-features';
import { Button } from '@/components/ui/button';
import { Pokemon } from '@/lib/generated/prisma/client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

const columnHelper = createColumnHelper<DataTableFeatures, Pokemon>();

export const columns = columnHelper.columns([
  // Sorting
  columnHelper.accessor('id', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (props) => (
      <span className="font-medium text-green-800">
        {props.row.getValue('id')}
      </span>
    ),
  }),

  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('description', {
    header: 'Description',
  }),
  columnHelper.accessor('imageUrl', {
    header: 'Image',
    cell: ({ row }) => (
      <div className="size-[80px] border">
        <Image
          src={row.original.imageUrl || '/'}
          width={80}
          height={80}
          className="grid size-full place-content-center object-cover"
          alt={row.original.name}
        />
      </div>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant={'secondary'}
          onClick={() => console.log(row.original.id)}
        >
          <Pencil />
        </Button>
        <Button
          variant={'destructive'}
          onClick={() => console.log(row.original.id)}
        >
          <Trash />
        </Button>
      </div>
    ),
  }),
]);
