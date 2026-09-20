import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import type { RootState } from '../../store/store';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        });
      }
    },

    // Xoá hẳn một sản phẩm khỏi giỏ theo id
    removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },

    // Cập nhật số lượng cụ thể cho một sản phẩm (vd: người dùng gõ tay vào ô input)
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (!item) return;

      if (quantity <= 0) {
        // Số lượng về 0 hoặc âm -> tự động xoá khỏi giỏ
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = quantity;
      }
    },

    // Tăng số lượng thêm 1 (dùng cho nút "+")
    incrementQuantity: (state, action: PayloadAction<{ id: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) item.quantity += 1;
    },

    // Giảm số lượng đi 1 (dùng cho nút "-"); nếu về 0 thì xoá luôn
    decrementQuantity: (state, action: PayloadAction<{ id: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        item.quantity -= 1;
      }
    },

    // Xoá sạch giỏ hàng
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

// ----- Selectors -----
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
