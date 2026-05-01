import { PokeCoinPackage } from './types/stripe';

export const POKECOIN_PACKAGES: Record<string, PokeCoinPackage> = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    pokecoins: 1000,
    price: 999, // $9.99
  },
  popular: {
    id: 'popular',
    name: 'Popular Pack',
    pokecoins: 5000,
    price: 4999, // $49.99
    bonus: 500, // 10% bonus
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate Pack',
    pokecoins: 10000,
    price: 8999, // $89.99
    bonus: 2000, // 20% bonus
  },
};
import { PokeCoinPackage } from './types/stripe';

export const POKECOIN_PACKAGES: Record<string, PokeCoinPackage> = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    pokecoins: 1000,
    price: 999, // $9.99
  },
  popular: {
    id: 'popular',
    name: 'Popular Pack',
    pokecoins: 5000,
    price: 4999, // $49.99
    bonus: 500, // 10% bonus
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate Pack',
    pokecoins: 10000,
    price: 8999, // $89.99
    bonus: 2000, // 20% bonus
  },
};
