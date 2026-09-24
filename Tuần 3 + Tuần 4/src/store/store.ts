import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';
import { productsApi } from '../features/products/productsApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    // Reducer riêng của RTK Query (dùng cho phần bonus useGetProductsQuery)
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Kiểu suy ra tự động từ store, dùng cho useAppSelector/useAppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
