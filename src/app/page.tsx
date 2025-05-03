// src/app/page.tsx
import prisma from "@/lib/prisma";
import { ProductList } from "@/components/product-list"; // Import the new client component

async function getProducts() {
  // Fetch products from the database
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc", // Show newest products first
    },
  });
  return products;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Plans</h1>
      {/* Use the ProductList component to render products */}
      <ProductList products={products} />
    </main>
  );
}
