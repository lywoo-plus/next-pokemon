'use client';

import { DataTableFeatures } from '@/components/data-table-features';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Pokemon } from '@/lib/generated/prisma/browser';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Pencil, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

const columnHelper = createColumnHelper<DataTableFeatures, Pokemon>();

export function createPokemonColumns({
  isDeleting,
  onDelete,
}: {
  isDeleting: boolean;
  onDelete: (pokemon: Pokemon) => void;
}) {
  return columnHelper.columns([
    // Sorting
    columnHelper.accessor('id', {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ID
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
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

    // Row Selection
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false, // hide it from the Visibility select option
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
            variant="destructive"
            aria-label={`Delete ${row.original.name}`}
            disabled={isDeleting}
            onClick={() => onDelete(row.original)}
          >
            <Trash2Icon />
          </Button>
        </div>
      ),
    }),
  ]);
}
