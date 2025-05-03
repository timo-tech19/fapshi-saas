// src/app/admin/products/new/page.tsx
"use client"; // This page needs client-side interactivity for the form

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
// We will create this action next
import { addProductAction } from "@/actions/product-actions";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) {
      setError("Price must be a valid number.");
      setIsLoading(false);
      return;
    }

    try {
      // Call the server action here
      await addProductAction({
        name,
        description,
        price: priceNumber,
        imageUrl,
      });
      // console.log('Product submitted (action not implemented yet):', { name, description, price: priceNumber, imageUrl });
      // Redirect to an admin product list page (or home for now)
      // Consider redirecting to a page showing the list of products
      router.push("/"); // Redirect to home page after successful addition
      // router.push('/admin/products'); // Or redirect to an admin product list page if it exists
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-4 flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (FCFA)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="any" // Allow decimals if needed in the future, though Prisma model might be Int
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://placekitten.com/400/300"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
