// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Create sample products
  const product1 = await prisma.product.upsert({
    where: { name: "Fapshi Basic Plan" }, // Use a unique field for upsert
    update: {},
    create: {
      name: "Fapshi Basic Plan",
      description: "Get started with essential features.",
      price: 5000, // Updated to FCFA
      imageUrl: "https://picsum.photos/300/200", // Placeholder image
    },
  });

  const product2 = await prisma.product.upsert({
    where: { name: "Fapshi Pro Plan" },
    update: {},
    create: {
      name: "Fapshi Pro Plan",
      description: "Unlock advanced features and priority support.",
      price: 15000, // Updated to FCFA
      imageUrl: "https://picsum.photos/301/201", // Placeholder image
    },
  });

  const product3 = await prisma.product.upsert({
    where: { name: "Fapshi Enterprise Plan" },
    update: {},
    create: {
      name: "Fapshi Enterprise Plan",
      description: "Tailored solutions for large businesses.",
      price: 50000, // Updated to FCFA
      imageUrl: "https://picsum.photos/302/202", // Placeholder image
    },
  });

  console.log(`Created/updated product: ${product1.name} (ID: ${product1.id})`);
  console.log(`Created/updated product: ${product2.name} (ID: ${product2.id})`);
  console.log(`Created/updated product: ${product3.name} (ID: ${product3.id})`);

  // Add more seed data as needed (e.g., Orders, Users)

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
