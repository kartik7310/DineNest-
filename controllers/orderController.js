import { stripe } from "../utils/stripe.js"
import { customError } from "../utils/customError.js";

export const createStripeCheckoutSession = async (req, res, next) => {
  try {
    const { items, restaurantId, userId } = req.body;

    if (!items || !restaurantId || !userId) {
      throw new customError("Missing required fields", 400);
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new customError("Restaurant not found", 404);
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.price * 100, // Amount in cents
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order-cancelled`,
      metadata: {
        userId,
        restaurantId,
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    next(error);
  }
};
