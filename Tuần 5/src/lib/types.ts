export type Category = 'Điện thoại' | 'Laptop' | 'Phụ kiện' | 'Gia dụng' | 'Thời trang' | 'Mỹ phẩm'

export interface Product {
  id: number
  sku: string
  name: string
  category: Category
  price: number
  stock: number
  sold: number
}

export type StockFilter = 'all' | 'in' | 'low' | 'out'
export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'best-seller'

export type UserRole = 'Quản trị' | 'Nhân viên' | 'Khách hàng'
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  orders: number
  spent: number
  active: boolean
}
