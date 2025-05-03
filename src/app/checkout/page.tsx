// src/app/checkout/page.tsx
"use client"; // Required for using hooks like useCartStore, useState, useTransition

import { useState, useTransition } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { initiatePaymentAction } from "@/actions/payment-actions"; // Import the server action
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display
import { Terminal } from "lucide-react"; // Icon for alert

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPrice = items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  // Updated function to call the server action
  const handlePayment = async () => {
    setErrorMessage(null); // Clear previous errors
    startTransition(async () => {
      try {
        // TODO: Replace with actual logged-in user's email
        const userEmail = "customer@example.com";

        const result = await initiatePaymentAction({
          amount: Math.round(parseFloat(totalPrice) * 100), // Convert to cents/lowest denomination if required by Fapshi
          email: userEmail, // Add user email
          items: items.map((item) => ({
            productId: item.id, // Map store item id to productId
            quantity: item.quantity,
            price: item.price * 100, // Ensure price is also in the lowest denomination if needed
          })),
          // Add other optional fields like userId if needed
        });

        if (result.success && result.paymentUrl) {
          console.log("Payment initiated, redirecting to:", result.paymentUrl);
          // Redirect on the client-side after successful action
          window.location.href = result.paymentUrl;
        } else {
          console.error("Payment initiation failed:", result.error);
          setErrorMessage(
            result.error || "Failed to initiate payment. Please try again."
          );
        }
      } catch (error) {
        console.error("Unexpected error during payment initiation:", error);
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
  };

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>
            Review the items in your cart before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
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
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  FCFA {(item.price * item.quantity).toFixed(0)}{" "}
                  {/* Assuming FCFA doesn't use decimals */}
                </p>
              </div>
            ))
          )}
          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>FCFA {totalPrice}</span>
              </div>
            </>
          )}
        </CardContent>
        {items.length > 0 && (
          <CardFooter>
            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={isPending} // Disable button while pending
            >
              {isPending ? "Processing..." : "Proceed to Payment"}{" "}
              {/* Show loading text */}
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
