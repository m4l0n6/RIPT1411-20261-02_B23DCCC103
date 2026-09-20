import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsError,
} from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function ProductList() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
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

  if (status === "failed") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Không tải được sản phẩm</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <img
              src={product.image}
              alt={product.title}
              className="mx-auto h-24 object-contain"
            />
          </CardHeader>
          <CardContent className="flex-1">
            <CardTitle
              className="font-medium text-sm line-clamp-2"
              title={product.title}
            >
              {product.title}
            </CardTitle>
            <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button
              size="sm"
              className="w-full"
              onClick={() => dispatch(addToCart({ product }))}
            >
              Thêm vào giỏ
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
