/// <reference types="jest" />

import {
  addPokemonSchema,
  updatePokemonSchema,
} from '@/features/pokemon/schemas';

describe('pokemon validation', () => {
  it('accepts a valid pokemon payload', () => {
    const result = addPokemonSchema.safeParse({
      name: 'Pikachu',
      description: 'Electric type Pokemon',
      imageUrl: 'https://example.com/pikachu.png',
    });

    expect(result.success).toBe(true);
  });

  it('requires an image when adding a pokemon', () => {
    const result = addPokemonSchema.safeParse({
      name: 'Pikachu',
      description: 'Electric type Pokemon',
      imageUrl: '',
    });

    expect(result.success).toBe(false);
  });

  it('allows the image to stay unchanged when updating a pokemon', () => {
    const result = updatePokemonSchema.safeParse({
      name: 'Pikachu',
      description: 'Electric type Pokemon',
    });

    expect(result.success).toBe(true);
  });
});
