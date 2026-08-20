'use client';

import { deletePokemon } from '@/actions/pokemon';
import { AlertDialogDestructive } from '@/components/alert-dialog-destructive';
import { DataTable } from '@/components/data-table';
import type { Pokemon } from '@/lib/generated/prisma/browser';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createPokemonColumns } from './pokemon-columns';

export function PokemonTable({ pokemons }: { pokemons: Pokemon[] }) {
  const [pokemonToDelete, setPokemonToDelete] = useState<Pokemon | null>(null);

  const [isDeleting, startDeleting] = useTransition();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRequestDelete = useCallback((pokemon: Pokemon) => {
    setPokemonToDelete(pokemon);
    setIsDeleteDialogOpen(true);
  }, []);

  const pokemonColumns = useMemo(
    () =>
      createPokemonColumns({
        isDeleting,
        onDelete: handleRequestDelete,
      }),
    [handleRequestDelete, isDeleting],
  );

  function handleDeletePokemon() {
    if (!pokemonToDelete) {
      return;
    }

    const pokemon = pokemonToDelete;

    startDeleting(async () => {
      try {
        await deletePokemon(pokemon.id);
        setIsDeleteDialogOpen(false);
        toast.success(`${pokemon.name} deleted`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete Pokemon',
        );
      }
    });
  }

  return (
    <DataTable columns={pokemonColumns} data={pokemons}>
      <AlertDialogDestructive
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open);
          }
        }}
        isLoading={isDeleting}
        title={`Delete ${pokemonToDelete?.name}?`}
        description={`This will permanently delete ${pokemonToDelete?.name} and its image file.`}
        onConfirm={handleDeletePokemon}
      />
    </DataTable>
  );
}
