import { useAppDispatch } from "../hooks/hooks";
import { useGetProductsQuery } from "../features/products/productsApi";
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
