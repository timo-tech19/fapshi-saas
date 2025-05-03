// src/actions/payment-actions.ts
"use server";

import { fapshi } from "@/lib/fapshi"; // Assuming this is the correct path
import prisma from "@/lib/prisma"; // Import Prisma client
import { z } from "zod";

// Define schema for individual cart items
const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
});

// Update payment schema to include cart items
const paymentSchema = z.object({
  amount: z.number().int().min(100, "Amount cannot be less than 100 FCFA"),
  email: z.string().email(), // Made email required
  userId: z.string().optional(), // Assuming userId is passed from the client
  // externalId is now generated internally (orderId)
  redirectUrl: z.string().url().optional(),
  message: z.string().optional(),
  items: z.array(cartItemSchema).min(1, "Cart cannot be empty"), // Add items array
});

interface InitiatePaymentResult {
  success: boolean;
  paymentUrl?: string;
  message?: string;
  error?: string;
}

export async function initiatePaymentAction(
  data: z.infer<typeof paymentSchema>
): Promise<InitiatePaymentResult> {
  try {
    // Validate input data including items
    const validatedData = paymentSchema.parse(data);

    console.log("Validated payment data:", validatedData);

    // --- Create Order in Database ---
    let newOrder;
    try {
      newOrder = await prisma.order.create({
        data: {
          customerEmail: validatedData.email, // Added customerEmail
          totalAmount: validatedData.amount,
          status: "PENDING", // Set initial status
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true }, // Include items if needed later
      });
      console.log("Order created successfully:", newOrder.id);
    } catch (dbError) {
      console.error("Database error creating order:", dbError);
      return {
        success: false,
        error: "Failed to create order before payment.",
      };
    }
    // --- End Create Order ---

    console.log("Initiating Fapshi payment for order:", newOrder.id);

    // Call Fapshi API with validated data, using order ID as externalId
    const paymentResponse = await fapshi.initiatePay({
      amount: validatedData.amount,
      email: validatedData.email,
      userId: validatedData.userId,
      externalId: newOrder.id, // Use the created order ID
      redirectUrl: validatedData.redirectUrl,
      message: validatedData.message,
    });

    console.log("Fapshi API Response:", paymentResponse);

    // Check the response from Fapshi and handle accordingly
    if (paymentResponse.success && paymentResponse.data?.link) {
      // Optionally update order with transaction ID from Fapshi if available
      // await db.order.update({ where: { id: newOrder.id }, data: { transactionId: paymentResponse.data.transId } });

      return {
        success: true,
        paymentUrl: paymentResponse.data.link,
        message:
          paymentResponse.message ||
          "Payment initiated successfully. Redirecting...",
      };
    } else {
      // Handle Fapshi API errors - potentially update order status to FAILED
      await prisma.order.update({
        where: { id: newOrder.id },
        data: { status: "FAILED" }, // Mark order as failed if payment initiation fails
      });
      const errorMessage =
        paymentResponse.message || "Failed to initiate payment.";
      console.error("Fapshi payment initiation failed:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error("Error initiating payment action:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid input data: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // General error handling - Consider if order needs status update here too
    return {
      success: false,
      error: "An unexpected error occurred during payment initiation.",
    };
  }
}
