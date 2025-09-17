import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";
import { ShippingAddress } from "@prisma/client";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      console.error("Webhook Error: Invalid signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      console.log("Stripe event received: checkout.session.completed");
      if (!event.data.object.customer_details?.email) {
        console.error("Webhook Error: Missing user email");
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        console.error("Webhook Error: Invalid request metadata", {
          userId,
          orderId,
        });
        throw new Error("Invalid request metadata");
      }

      console.log(
        "Raw Stripe Session Shipping Details:",
        session.shipping_details
      );

      const billingAddress = session.customer_details?.address;
      const shippingAddress =
        session.shipping_details?.address || session.customer_details?.address; // Use customer_details address if shipping_details is undefined
      const customerName = session.customer_details?.name;

      let updatedOrder = null; // Declare updatedOrder here

      try {
        updatedOrder = await db.order.update({
          where: {
            id: orderId,
          },
          data: {
            isPaid: true,
            ...(shippingAddress &&
              customerName && {
                shippingAddress: {
                  create: {
                    name: customerName,
                    city: shippingAddress.city!,
                    country: shippingAddress.country!,
                    postalCode: shippingAddress.postal_code!,
                    street: shippingAddress.line1!,
                    state: shippingAddress.state,
                  },
                },
              }),
            ...(billingAddress &&
              customerName && {
                billingAddress: {
                  create: {
                    name: customerName,
                    city: billingAddress.city!,
                    country: billingAddress.country!,
                    postalCode: billingAddress.postal_code!,
                    street: billingAddress.line1!,
                    state: billingAddress.state,
                  },
                },
              }),
          },
          include: {
            shippingAddress: true,
            billingAddress: true, // Include billing address as well
          },
        });
        console.log("Order updated as paid in DB: ", updatedOrder.id);
      } catch (dbError) {
        console.error(
          "Stripe Webhook Error: Failed to update order in DB:",
          dbError
        );
        return new Response("Failed to update order in DB", { status: 500 });
      }

      // Only send email if Resend is configured
      if (resend) {
        console.log(
          "Attempting to send order received email to: ",
          event.data.object.customer_details.email
        );
        await resend.emails.send({
          from: "CaseRussell <onboarding@resend.dev>",
          to: [event.data.object.customer_details.email],
          subject: "Thanks for your order!",
          react: OrderReceivedEmail({
            orderId,
            orderDate: updatedOrder.createdAt.toLocaleDateString(),
            shippingAddress: updatedOrder.shippingAddress as
              | ShippingAddress
              | undefined,
          }),
        });
        console.log("Order received email sent successfully.");
      } else {
        console.log("Resend API key not configured - skipping email");
      }
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error("Stripe Webhook Error:", err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
