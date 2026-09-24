import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useFavoritesStore } from "../store/favoritesStore";

export function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Sản phẩm yêu thích
          <Badge variant="secondary">{favorites.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {favorites.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Chưa có sản phẩm yêu thích.
          </p>
        ) : (
          favorites.map((product) => (
            <div key={product.id} className="flex items-center gap-3">
              <img
                src={product.image}
                alt={product.title}
                className="w-10 h-10 object-contain shrink-0"
              />
              <p className="flex-1 min-w-0 font-medium text-sm truncate" title={product.title}>
                {product.title}
              </p>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Bỏ ${product.title} khỏi danh sách yêu thích`}
                onClick={() => removeFavorite(product.id)}
              >
                <X />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}