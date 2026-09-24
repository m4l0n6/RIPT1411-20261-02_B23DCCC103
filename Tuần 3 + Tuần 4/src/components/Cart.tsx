import { Minus, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          Giỏ hàng
          <Badge variant="secondary">{totalQuantity}</Badge>
        </CardTitle>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => dispatch(clearCart())}
          >
            Xoá tất cả
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Giỏ hàng đang trống.</p>
        ) : (
          items.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-10 object-contain shrink-0"
                />

                <div className="flex-1 min-w-0 overflow-hidden">
                  <p
                    className="font-medium text-sm truncate"
                    title={item.title}
                  >
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">
                    ${item.price.toFixed(2)}
                  </p>
                </div>  

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => dispatch(decrementQuantity({ id: item.id }))}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: Number(e.target.value),
                        }),
                      )
                    }
                    className="px-1 w-12 h-7 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => dispatch(incrementQuantity({ id: item.id }))}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <p className="w-16 font-semibold text-sm text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-destructive"
                  onClick={() => dispatch(removeFromCart({ id: item.id }))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex justify-between items-center border-t">
          <span className="text-muted-foreground text-sm">Tổng cộng</span>
          <span className="font-semibold text-lg">
            ${totalPrice.toFixed(2)}
          </span>
        </CardFooter>
      )}
    </Card>
  );
}
