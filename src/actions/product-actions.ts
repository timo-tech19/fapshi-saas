// src/actions/product-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define a schema for product input validation using Zod
const ProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z.string().optional(), // Description is optional
  price: z.number().positive({ message: "Price must be a positive number." }),
  imageUrl: z
    .string()
    .url({ message: "Image URL must be a valid URL." })
    .optional()
    .or(z.literal("")), // Optional and allow empty string
});

interface AddProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export async function addProductAction(data: AddProductInput) {
  // Validate the input data
  const validationResult = ProductSchema.safeParse(data);

  if (!validationResult.success) {
    // Combine error messages if multiple validation errors occur
    const errorMessages = validationResult.error.errors
      .map((e) => e.message)
      .join(", ");
    console.error("Validation failed:", errorMessages);
    // Throw an error or return a structured error response
    // For simplicity, throwing an error here
    throw new Error(`Validation failed: ${errorMessages}`);
  }

  const { name, description, price, imageUrl } = validationResult.data;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null, // Store null if description is empty
        price,
        imageUrl: imageUrl || null, // Store null if imageUrl is empty
      },
    });

    console.log("Product created:", newProduct);

    // Revalidate paths where the product list might be displayed
    revalidatePath("/"); // Revalidate the home page
    revalidatePath("/admin/products"); // Revalidate potential admin product list page

    // Return the created product or a success message
    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Failed to create product in database:", error);
    // Throw a more specific error or return a structured error response
    if (error instanceof Error) {
      throw new Error(`Database error: ${error.message}`);
    } else {
      throw new Error("An unknown database error occurred.");
    }
  }
}
