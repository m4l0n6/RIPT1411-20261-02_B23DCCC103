# 1. Xác định Entity

Có 4 entity chính:

- `Customer`
- `Product`
- `OrderItem`
- `Order`

Quan hệ giữa các entity:

- `Customer` → có nhiều `Order`.
- `Order` → thuộc một `Customer`, có nhiều `OrderItem`.
- `OrderItem` → đại diện cho một `Product`.
- `Product` → có thể xuất hiện trong nhiều `OrderItem`.

# 2. `Product`

`Product` lưu thông tin sản phẩm gồm `id`, `name`, `price`, `stock`.

Sử dụng `interface` để định nghĩa cấu trúc của entity.

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}
```

# 3. `OrderItem`

`OrderItem` gồm sản phẩm và số lượng:

```ts
interface OrderItem {
  product: OrderProduct;
  quantity: number;
}
```

Sử dụng `Pick` để chỉ lấy các thuộc tính cần thiết của `Product`, tránh khai báo lại:

```ts
type OrderProduct = Pick<Product, "id" | "name" | "price">;
```

# 4. `Customer`

`Customer` lưu thông tin khách hàng gồm `id`, `name`, `email`, `phone`.

# 5. `Order`

`Order` liên kết `Customer`, `OrderItem[]` và `OrderStatus`, đồng thời lưu tổng tiền và thời gian tạo.

# 6. Generic API Response

Dùng Generic để tái sử dụng cấu trúc response cho nhiều loại dữ liệu:

```ts
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

Ví dụ: `ApiResponse<Order>`, `ApiResponse<Product>`.

# 7. Create / Update

- `Partial<Product>` → dùng cho update vì các thuộc tính không bắt buộc.
- `Omit<Product, "id">` → dùng cho create vì `id` được hệ thống tạo.

# 8. Pagination

Dùng Generic để tái sử dụng cấu trúc phân trang:

```ts
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
```

Có thể dùng cho `Product`, `Customer` hoặc `Order`.

# 9. Enum

Dùng `OrderStatus` để giới hạn các trạng thái hợp lệ của đơn hàng:

```ts
enum OrderStatus {
  Pending,
  Processing,
  Shipped,
  Delivered,
  Cancelled,
}
```
