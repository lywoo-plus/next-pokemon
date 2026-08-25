'use client';

import { DataTableFeatures } from '@/components/data-table-features';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Pokemon } from '@/lib/generated/prisma/browser';
import { cn } from '@/lib/utils';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Eye, Pencil, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<DataTableFeatures, Pokemon>();

export function usePokemonColumns({
  isDeleting,
  onDelete,
}: {
  isDeleting: boolean;
  onDelete: (pokemon: Pokemon) => void;
}) {
  const router = useRouter();

  return useMemo(
    () =>
      columnHelper.columns([
        // Sorting
        columnHelper.accessor('id', {
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
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
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
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
              <Link
                href={`/pokemon/detail/${row.original.id}`}
                className={cn(
                  buttonVariants({ variant: 'secondary' }),
                  'text-blue-500',
                )}
                aria-label={`Edit ${row.original.name}`}
              >
                <Eye />
              </Link>

              <Link
                href={`/pokemon/detail/${row.original.id}/edit`}
                className={cn(buttonVariants({ variant: 'secondary' }))}
                aria-label={`Edit ${row.original.name}`}
              >
                <Pencil />
              </Link>

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
      ]),
    [isDeleting, onDelete],
  );
}
