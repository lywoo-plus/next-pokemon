import 'server-only';

import { deleteS3ObjectByPublicUrl } from '@/integrations/s3';
import { deletePokemonRecord } from './mutations';

export async function removePokemon(id: number) {
  const pokemon = await deletePokemonRecord(id);

  if (pokemon.imageUrl) {
    await deleteS3ObjectByPublicUrl(pokemon.imageUrl);
  }

  return pokemon;
}
