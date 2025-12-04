import { stripe } from "../utils/stripe.js";
import { customError } from "../utils/customError.js";
import { prisma } from "../utils/prismaClient.js";

export const createStripeCheckoutSession = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const{id} = req.user;
    if (!restaurantId || !id) {
      throw new customError("Missing required fields", 400);
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new customError("Restaurant not found", 404);
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId:id },
      include: { menu: true },
    });

    if (!cartItems || cartItems.length === 0) {
      throw new customError("Cart is empty", 400);
    }

    // Map cart items to Stripe line items
    const lineItems = cartItems.map((cart) => {
      if (typeof cart.menu.price !== "number" || cart.menu.price <= 0) {
        throw new customError("Invalid price for menu item", 400);
      }
      if (typeof cart.quantity !== "number" || cart.quantity <= 0) {
        throw new customError("Invalid quantity for menu item", 400);
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: cart.menu.name,
            description: cart.menu.description,
          },
          unit_amount: Math.round(cart.menu.price * 100), // Convert to cents
        },
        quantity: cart.quantity,
      };
    });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order-cancelled`,
      metadata: {
        userId,
        restaurantId,
      },
    });

    // Return session ID to the client
    res.status(200).json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error in createStripeCheckoutSession:", error);
    next(error);
  }
};
