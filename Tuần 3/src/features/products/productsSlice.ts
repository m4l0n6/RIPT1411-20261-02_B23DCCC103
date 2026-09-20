import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import type { RootState } from '../../store/store';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      return rejectWithValue(`Lỗi HTTP: ${response.status}`);
    }
    const data: Product[] = await response.json();
    return data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm'
    );
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Có thể mở rộng thêm reducer đồng bộ nếu cần (vd: clearProducts)
    clearProductsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi';
      });
  },
});

export const { clearProductsError } = productsSlice.actions;

// ----- Selectors -----
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
