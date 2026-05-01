import stripe from '../lib/stripe';
import { POKECOIN_PACKAGES } from '../lib/pokecoin-packages';
import { CheckoutSessionRequest, CheckoutSessionResponse } from '../lib/types/stripe';

// POST /api/payments/checkout
export async function createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  try {
    const { packageId, userId, email } = req;

    // Validar que el paquete existe
    const package_ = POKECOIN_PACKAGES[packageId];
    if (!package_) {
      throw new Error(`Package ${packageId} not found`);
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: package_.name,
              description: `${package_.pokecoins} PokéCoins${package_.bonus ? ` + ${package_.bonus} bonus` : ''}`,
            },
            unit_amount: package_.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
      customer_email: email,
      metadata: {
        userId,
        packageId,
        pokecoins: (package_.pokecoins + (package_.bonus || 0)).toString(),
      },
    });

    return {
      sessionId: session.id,
      clientSecret: session.client_secret || '',
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// GET /api/payments/session/:sessionId
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      id: session.id,
      status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}
import stripe from '../lib/stripe';
import { POKECOIN_PACKAGES } from '../lib/pokecoin-packages';
import { CheckoutSessionRequest, CheckoutSessionResponse } from '../lib/types/stripe';

// POST /api/payments/checkout
export async function createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  try {
    const { packageId, userId, email } = req;

    // Validar que el paquete existe
    const package_ = POKECOIN_PACKAGES[packageId];
    if (!package_) {
      throw new Error(`Package ${packageId} not found`);
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: package_.name,
              description: `${package_.pokecoins} PokéCoins${package_.bonus ? ` + ${package_.bonus} bonus` : ''}`,
            },
            unit_amount: package_.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
      customer_email: email,
      metadata: {
        userId,
        packageId,
        pokecoins: (package_.pokecoins + (package_.bonus || 0)).toString(),
      },
    });

    return {
      sessionId: session.id,
      clientSecret: session.client_secret || '',
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// GET /api/payments/session/:sessionId
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      id: session.id,
      status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}
