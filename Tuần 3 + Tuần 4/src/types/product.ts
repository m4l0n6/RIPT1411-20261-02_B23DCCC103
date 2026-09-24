// Kiểu dữ liệu sản phẩm dùng chung cho cả productsSlice và RTK Query API
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
