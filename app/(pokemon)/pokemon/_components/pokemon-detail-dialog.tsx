'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pokemon } from '@/lib/generated/prisma/browser';
import { useRouter } from 'next/navigation';
import PokemonDetailCard from './pokemon-detail-card';

export default function PokemonDetailDialog({ pokemon }: { pokemon: Pokemon }) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pokemon #{pokemon.id}</DialogTitle>
        </DialogHeader>

        <PokemonDetailCard pokemon={pokemon} className="md:w-full" />
      </DialogContent>
    </Dialog>
  );
}
