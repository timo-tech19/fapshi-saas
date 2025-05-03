// src/app/api/webhook/fapshi/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionData } from "@/lib/fapshi";

export async function POST(req: NextRequest) {
  console.log("Fapshi webhook received");

  try {
    const payload: TransactionData = await req.json();
    console.log("Webhook Payload:", payload);

    // Use externalId (which is our orderId) and status from the payload
    const { externalId, status, transId } = payload;

    if (!externalId) {
      console.error("Fapshi Webhook Error: Missing externalId (orderId)");
      // Still return 200 to acknowledge receipt, but log the error
      return NextResponse.json(
        { error: "Missing externalId (orderId)" },
        { status: 200 } // Acknowledge to prevent retries for bad data
      );
    }

    // Find the order using the externalId (which is the order's primary key)
    const order = await prisma.order.findUnique({
      where: { id: externalId }, // Find by the order ID passed as externalId
    });

    if (!order) {
      console.error(
        `Fapshi Webhook Error: Order not found for externalId (orderId): ${externalId}`
      );
      // Return 200 even if order not found to prevent Fapshi from retrying indefinitely
      return NextResponse.json(
        { message: "Order not found, but webhook acknowledged" },
        { status: 200 }
      );
    }

    // Update the order status based on the webhook payload
    // Map Fapshi status to your application's status using string literals
    let newStatus: string = "PENDING"; // Default status
    if (status === "SUCCESSFUL") {
      newStatus = "PAID";
    } else if (status === "FAILED" || status === "EXPIRED") {
      // Consider EXPIRED as FAILED
      newStatus = "FAILED";
    }
    // Add more status mappings if needed

    if (order.status !== newStatus) {
      // Only update if the status has changed
      await prisma.order.update({
        where: { id: order.id },
        // Include fapshiTxRef if you want to store the transaction ID from Fapshi
        data: { status: newStatus, fapshiTxRef: transId },
      });
      console.log(
        `Order ${order.id} status updated to ${newStatus} for Fapshi transaction: ${transId}`
      );
    } else {
      console.log(
        `Order ${order.id} status already ${newStatus}. No update needed.`
      );
    }

    // Acknowledge receipt of the webhook
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fapshi Webhook Error:", error);
    // Ensure a response is sent even in case of errors to prevent Fapshi retries
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
