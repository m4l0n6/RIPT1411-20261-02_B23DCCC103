import { useAppDispatch } from "../hooks/hooks";
import { useGetProductsQuery } from "../features/products/productsApi";
import { addToCart } from "../features/cart/cartSlice";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Product from "./Product";

export function ProductListRTKQuery() {
  const dispatch = useAppDispatch();
  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="w-full h-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 w-3/4 h-4" />
              <Skeleton className="w-1/3 h-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Không tải được sản phẩm (RTK Query)</AlertTitle>
        <AlertDescription>
          {error && "status" in error ? String(error.status) : "Không xác định"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
      {products?.map((product) => (
        <Product
          key={product.id}
          product={product}
          onAddToCart={() => dispatch(addToCart({ product }))}
        />
      ))}
    </div>
  );
}
