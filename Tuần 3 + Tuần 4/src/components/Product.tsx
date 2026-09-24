import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import type { Product as ProductType } from "../types/product";
import { useFavoritesStore } from "../store/favoritesStore";

interface ProductProps {
  product: ProductType;
  onAddToCart?: () => void;
}

const Product: React.FC<ProductProps> = ({ product, onAddToCart }) => {
    const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

    return (
        <Card className="flex flex-col">
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
                  <CardFooter className="flex flex-col">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={onAddToCart}
                    >
                      Thêm vào giỏ
                    </Button>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      variant={isFavorite ? "default" : "outline"}
                      onClick={() => toggleFavorite(product)}
                      aria-pressed={isFavorite}
                    >
                      <Heart className={isFavorite ? "fill-current" : ""} />
                      {isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    </Button>
                  </CardFooter>
                </Card>
    )
}

export default Product;