// src/components/product-list.tsx
"use client";

import Image from "next/image";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI setup places components here
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store"; // Adjust path if needed

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            {product.imageUrl && (
              <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  priority={products.indexOf(product) < 3} // Prioritize loading for first few images
                />
              </div>
            )}
            <CardTitle>{product.name}</CardTitle>
            {product.description && (
              <CardDescription>{product.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-2xl font-bold">
              FCFA {product.price.toFixed(0)}
            </p>{" "}
            {/* Assuming FCFA doesn't use decimals */}
          </CardContent>
          <CardFooter>
            <Button onClick={() => addItem(product)} className="w-full">
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
