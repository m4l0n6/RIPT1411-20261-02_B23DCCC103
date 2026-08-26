// Entity
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

type OrderProduct = Pick<Product, "id" | "name" | "price">;

interface OrderItem {
  product: OrderProduct;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: number;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
}

// API
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

type UpdateProduct = Partial<Product>;

type CreateProduct = Omit<Product, "id">;

type CreateCustomer = Omit<Customer, "id">;

// Pagiantion
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

type CustomerListResponse = PaginatedResponse<Customer>;

type ProductListResponse = PaginatedResponse<Product>;

type OrderListResponse = PaginatedResponse<Order>;

// Status
enum OrderStatus {
  Pending,
  Processing,
  Shipped,
  Delivered,
  Cancelled,
}

enum PaymentStatus {
  Pending,
  Paid,
  Failed,
}

