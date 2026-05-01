import stripe from '../lib/stripe';
import { PaymentWebhook } from '../lib/types/stripe';

// POST /api/payments/webhook
export async function handleStripeWebhook(body: string, signature: string) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    throw new Error(`Webhook Error: ${error.message}`);
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      return await handlePaymentSuccess(event.data.object as any);

    case 'payment_intent.payment_failed':
      return await handlePaymentFailed(event.data.object as any);

    case 'charge.refunded':
      return await handleRefund(event.data.object as any);

    default:
      console.log(`Unhandled event type: ${event.type}`);
      return { received: true };
  }
}

async function handlePaymentSuccess(session: any) {
  try {
    const { userId, packageId, pokecoins } = session.metadata;

    console.log(`Payment successful for user ${userId}`);
    console.log(`Granting ${pokecoins} pokecoins from package ${packageId}`);

    // TODO: Implementar lógica para:
    // 1. Verificar usuario
    // 2. Agregar pokecoins a la cuenta
    // 3. Guardar transacción en BD
    // 4. Enviar confirmación por email

    return {
      success: true,
      message: 'PokéCoins granted successfully',
      userId,
      pokecoins,
    };
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    const { userId } = paymentIntent.metadata;

    console.log(`Payment failed for user ${userId}`);
    console.log(`Error: ${paymentIntent.last_payment_error?.message}`);

    // TODO: Implementar lógica para:
    // 1. Registrar fallo en BD
    // 2. Notificar al usuario

    return {
      success: true,
      message: 'Payment failure handled',
      userId,
    };
  } catch (error) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
}

async function handleRefund(charge: any) {
  try {
    const { userId, packageId } = charge.metadata;

    console.log(`Refund processed for user ${userId}, package ${packageId}`);

    // TODO: Implementar lógica para:
    // 1. Restar pokecoins si aún no fueron usados
    // 2. Registrar reembolso en BD
    // 3. Notificar al usuario

    return {
      success: true,
      message: 'Refund processed',
      userId,
    };
  } catch (error) {
    console.error('Error handling refund:', error);
    throw error;
  }
}
import stripe from '../lib/stripe';
import { PaymentWebhook } from '../lib/types/stripe';

// POST /api/payments/webhook
export async function handleStripeWebhook(body: string, signature: string) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    throw new Error(`Webhook Error: ${error.message}`);
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      return await handlePaymentSuccess(event.data.object as any);

    case 'payment_intent.payment_failed':
      return await handlePaymentFailed(event.data.object as any);

    case 'charge.refunded':
      return await handleRefund(event.data.object as any);

    default:
      console.log(`Unhandled event type: ${event.type}`);
      return { received: true };
  }
}

async function handlePaymentSuccess(session: any) {
  try {
    const { userId, packageId, pokecoins } = session.metadata;

    console.log(`Payment successful for user ${userId}`);
    console.log(`Granting ${pokecoins} pokecoins from package ${packageId}`);

    // TODO: Implementar lógica para:
    // 1. Verificar usuario
    // 2. Agregar pokecoins a la cuenta
    // 3. Guardar transacción en BD
    // 4. Enviar confirmación por email

    return {
      success: true,
      message: 'PokéCoins granted successfully',
      userId,
      pokecoins,
    };
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    const { userId } = paymentIntent.metadata;

    console.log(`Payment failed for user ${userId}`);
    console.log(`Error: ${paymentIntent.last_payment_error?.message}`);

    // TODO: Implementar lógica para:
    // 1. Registrar fallo en BD
    // 2. Notificar al usuario

    return {
      success: true,
      message: 'Payment failure handled',
      userId,
    };
  } catch (error) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
}

async function handleRefund(charge: any) {
  try {
    const { userId, packageId } = charge.metadata;

    console.log(`Refund processed for user ${userId}, package ${packageId}`);

    // TODO: Implementar lógica para:
    // 1. Restar pokecoins si aún no fueron usados
    // 2. Registrar reembolso en BD
    // 3. Notificar al usuario

    return {
      success: true,
      message: 'Refund processed',
      userId,
    };
  } catch (error) {
    console.error('Error handling refund:', error);
    throw error;
  }
}
