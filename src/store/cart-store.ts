// src/store/cart-store.ts
import { create } from "zustand";
import { Product } from "@prisma/client"; // Assuming Product type is available

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  // Add other actions like removeItem, updateQuantity, clearCart later
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, increase quantity
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // If item doesn't exist, add it with quantity 1
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }
    }),
}));
