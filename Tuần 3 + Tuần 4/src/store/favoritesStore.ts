import { create } from "zustand";
import type { Product } from "../types/product";

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggleFavorite: (product) =>
    set((state) => {
      const isAlreadyFavorite = state.favorites.some(
        (favorite) => favorite.id === product.id,
      );

      return {
        favorites: isAlreadyFavorite
          ? state.favorites.filter((favorite) => favorite.id !== product.id)
          : [...state.favorites, product],
      };
    }),
  removeFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.filter((favorite) => favorite.id !== productId),
    })),
  isFavorite: (productId) =>
    get().favorites.some((favorite) => favorite.id === productId),
}));