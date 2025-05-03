// src/components/cart.tsx
"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react"; // Icon for the cart trigger
import Image from "next/image";
import Link from "next/link"; // Import Link

export function Cart() {
  const items = useCartStore((state) => state.items);
  // Add functions for removing items or updating quantity later
  // const removeItem = useCartStore((state) => state.removeItem);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
          <SheetDescription>
            Review items in your cart. Proceed to checkout when ready.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      FCFA {(item.price * item.quantity).toFixed(0)}{" "}
                      {/* Assuming FCFA doesn't use decimals */}
                    </p>
                    {/* Add remove button later */}
                    {/* <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {items.length > 0 && (
          <SheetFooter className="mt-auto border-t pt-4">
            <div className="flex justify-between w-full text-lg font-semibold">
              <span>Total:</span>
              <span>FCFA {totalPrice}</span>
            </div>
            {/* Wrap Button with Link */}
            <Link href="/checkout" passHref legacyBehavior>
              <Button asChild className="w-full mt-4">
                <a>Proceed to Checkout</a>
              </Button>
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
