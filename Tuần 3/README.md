# Giỏ hàng — Redux Toolkit + TypeScript

## Cài đặt & chạy
```bash
npm install
npm run dev
```

## Cấu trúc thư mục (feature-based)
```
src/
  app/
    store.ts       # configureStore, RootState, AppDispatch
    hooks.ts       # useAppDispatch, useAppSelector đã gõ kiểu
  features/
    cart/
      cartSlice.ts       # add/remove/update quantity, selectors
    products/
      productsSlice.ts   # createAsyncThunk fetchProducts
      productsApi.ts      # (bonus) RTK Query — useGetProductsQuery
  components/
    ProductList.tsx        # dùng productsSlice (thunk)
    ProductListRTKQuery.tsx # dùng productsApi (RTK Query)
    Cart.tsx
  types/
    product.ts
```

## Ghi chú
- API giả lập: https://fakestoreapi.com/products (public fake REST API).
- Toàn bộ component chỉ dùng `useAppDispatch` / `useAppSelector` từ `app/hooks.ts`,
  không import `useDispatch`/`useSelector` trực tiếp từ react-redux.
- `App.tsx` có nút chuyển đổi giữa 2 cách lấy dữ liệu (createAsyncThunk vs RTK Query)
  để tiện so sánh/demo cả hai cách trong cùng một bài nộp.
- cartSlice hỗ trợ: addToCart, removeFromCart, updateQuantity, incrementQuantity,
  decrementQuantity, clearCart — cùng các selector tính tổng số lượng/tổng tiền.
