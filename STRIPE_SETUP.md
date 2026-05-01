# Stripe Integration Guide

## Quick Start

### 1. Get Stripe API Keys

1. Visit [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up or log in
3. Go to **Developers** → **API Keys**
4. Copy your **Publishable Key** and **Secret Key** (use Test keys for development)

### 2. Setup Webhook (Optional - for production)

1. In Stripe Dashboard: **Developers** → **Webhooks**
2. Create a new endpoint pointing to your server
3. Subscribe to: `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy the **Signing Secret**

### 3. Backend Configuration

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and add your Stripe keys:
```
STRIPE_SECRET_KEY=sk_test_... (your secret key)
STRIPE_PUBLISHABLE_KEY=pk_test_... (your publishable key)
STRIPE_WEBHOOK_SECRET=whsec_... (optional, for webhooks)
```

### 4. Frontend Configuration

```bash
cd frontend
npm install
```

Create `.env.local` (copy from `.env.example`):
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Stripe publishable key:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (your publishable key)
VITE_API_URL=http://localhost:3001
```

## API Endpoints

### 1. Create Checkout Session

**POST** `/api/payments/checkout`

Request:
```json
{
  "packageId": "popular",
  "userId": "user123",
  "email": "user@example.com"
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "clientSecret": "..."
}
```

### 2. Get Session Status

**GET** `/api/payments/session/:sessionId`

Response:
```json
{
  "id": "cs_test_...",
  "status": "paid",
  "customer_email": "user@example.com",
  "amount_total": 4999,
  "metadata": {
    "userId": "user123",
    "packageId": "popular",
    "pokecoins": "5500"
  }
}
```

### 3. Webhook Events

**POST** `/api/payments/webhook`

Events received:
- `checkout.session.completed` - Payment successful ✅
- `payment_intent.payment_failed` - Payment failed ❌
- `charge.refunded` - Refund processed 💰

## PokéCoin Packages

| Package | Coins | Price | Bonus |
|---------|-------|-------|-------|
| Starter | 1,000 | $9.99 | - |
| Popular | 5,000 | $49.99 | +500 |
| Ultimate | 10,000 | $89.99 | +2,000 |

## Testing with Stripe Test Cards

Use these test card numbers:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Exp: Any future date
- CVC: Any 3 digits

**Card Declined:**
- Card: `4000 0000 0000 0002`
- Exp: Any future date
- CVC: Any 3 digits

**3D Secure Required:**
- Card: `4000 0025 0000 3155`
- Exp: Any future date
- CVC: Any 3 digits

## Local Webhook Testing

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

Login and listen for webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3001/api/payments/webhook
```

Copy the webhook signing secret to your `.env` file:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Payment Flow

```
User selects package
        ↓
Frontend sends POST /api/payments/checkout
        ↓
Backend creates Stripe session
        ↓
Frontend redirects to Stripe Checkout
        ↓
User enters payment details
        ↓
Stripe processes payment
        ↓
Redirect to /payment-success or /payment-cancelled
        ↓
Webhook triggered: checkout.session.completed
        ↓
Backend grants PokéCoins to user
```

## TODO - To be implemented

- [ ] Save transactions to database
- [ ] Add pokecoins to user account in webhook
- [ ] Send confirmation email
- [ ] Log failed payment attempts
- [ ] Handle refunds properly
- [ ] Implement transaction history
- [ ] Admin panel for payment monitoring
- [ ] Anti-fraud measures
- [ ] Rate limiting

## Security Notes

- ⚠️ Never commit `.env` files with real keys
- ⚠️ Never expose SECRET keys in frontend code
- ⚠️ Always verify webhook signatures
- ✅ Publishable keys can be exposed in frontend (they're public)
- ✅ Use HTTPS in production
- ✅ Enable 3D Secure for extra security

## References

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Test Data](https://stripe.com/docs/testing)
- [CLI Documentation](https://stripe.com/docs/stripe-cli)
# Stripe Integration Guide

## Setup

### 1. Claves de Stripe

Obtén estas claves de https://dashboard.stripe.com:

- **Publishable Key** (pk_test_...): Frontend - Es segura exponerla
- **Secret Key** (sk_test_...): Backend - ⚠️ MANTÉN EN SECRETO
- **Webhook Secret**: Para validar webhooks

### 2. Backend Setup

```bash
cd backend
npm install stripe
```

Variables en `.env` (copiar de `.env.example` y agregar tus claves):
```
STRIPE_SECRET_KEY=sk_test_... (obtén de Stripe Dashboard)
STRIPE_PUBLISHABLE_KEY=pk_test_... (obtén de Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_... (obtén de webhooks en Stripe Dashboard)
```

### 3. Frontend Setup

```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/js
```

Crear `.env.local`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TSDMPLlGSOMZAGtcsV6pu79GlXlp1KxxXwcRmwHjemijHgd9wEec2dTAJ2v2YADiHdI3rZWu9oWhPSFGrqTv3vb008bdXfeoC
VITE_API_URL=http://localhost:3001
```

## API Endpoints

### 1. Crear Sesión de Checkout

**POST** `/api/payments/checkout`

```json
{
  "packageId": "popular",
  "userId": "user123",
  "email": "user@example.com"
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "clientSecret": "..."
}
```

### 2. Obtener Estado de Sesión

**GET** `/api/payments/session/:sessionId`

Response:
```json
{
  "id": "cs_test_...",
  "status": "paid",
  "customer_email": "user@example.com",
  "amount_total": 4999,
  "metadata": {
    "userId": "user123",
    "packageId": "popular",
    "pokecoins": "5500"
  }
}
```

### 3. Webhook

**POST** `/api/payments/webhook`

Escucha eventos de Stripe:
- `checkout.session.completed` - Pago completado ✅
- `payment_intent.payment_failed` - Pago fallido ❌
- `charge.refunded` - Reembolso procesado 💰

## Testing

### Tarjetas de Prueba (Stripe)

- **Éxito**: 4242 4242 4242 4242
- **Declino**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

CVC: Cualquiera (ej: 123)
Fecha: Cualquier fecha futura

### Probar Webhook Localmente

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:3001/api/payments/webhook

# Copiar webhook signing secret a .env
```

## Paquetes de PokéCoins

| Paquete | Monedas | Precio | Bonus |
|---------|---------|--------|-------|
| Starter | 1,000 | $9.99 | - |
| Popular | 5,000 | $49.99 | +500 |
| Ultimate | 10,000 | $89.99 | +2,000 |

## Flujo de Pago

1. Usuario selecciona paquete de PokéCoins
2. Frontend envía POST a `/api/payments/checkout`
3. Backend crea sesión Stripe y retorna sessionId
4. Frontend redirige a Stripe Checkout
5. Stripe procesa pago y redirige a `payment-success` o `payment-cancelled`
6. Backend recibe webhook cuando pago se completa
7. Webhook agrega PokéCoins a cuenta del usuario
8. Frontend verifica pago y muestra confirmación

## TODO - Por Implementar

- [ ] Guardar transacciones en BD
- [ ] Sumar PokéCoins a cuenta del usuario
- [ ] Enviar confirmación por email
- [ ] Registrar intentos fallidos
- [ ] Manejar reembolsos
- [ ] Historial de transacciones
- [ ] Panel de administración para ver pagos

## Referencias

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
