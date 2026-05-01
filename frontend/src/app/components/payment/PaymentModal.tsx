import React, { useState } from 'react';
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const POKECOIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    pokecoins: 1000,
    price: 9.99,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    pokecoins: 5000,
    price: 49.99,
    bonus: 500,
    badge: 'Popular',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    pokecoins: 10000,
    price: 89.99,
    bonus: 2000,
    badge: 'Best Value',
  },
];

export function PaymentModal({ userId, email, onClose }: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const [selectedPackage, setSelectedPackage] = useState('popular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Crear sesión de checkout
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          userId,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          setError(error.message || 'Checkout failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Buy PokéCoins</h2>

        {/* Paquetes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {POKECOIN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pkg.badge && (
                <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded mb-2 inline-block">
                  {pkg.badge}
                </div>
              )}
              <h3 className="font-semibold mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold text-yellow-600 mb-2">
                ${pkg.price}
              </p>
              <p className="text-sm text-gray-600">
                {pkg.pokecoins} Coins
              </p>
              {pkg.bonus && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  +{pkg.bonus} Bonus
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentModal userId="user123" email="user@example.com" onClose={() => {}} />
    </Elements>
  );
}
import React, { useState } from 'react';
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const POKECOIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    pokecoins: 1000,
    price: 9.99,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    pokecoins: 5000,
    price: 49.99,
    bonus: 500,
    badge: 'Popular',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    pokecoins: 10000,
    price: 89.99,
    bonus: 2000,
    badge: 'Best Value',
  },
];

export function PaymentModal({ userId, email, onClose }: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const [selectedPackage, setSelectedPackage] = useState('popular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Crear sesión de checkout
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          userId,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          setError(error.message || 'Checkout failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Buy PokéCoins</h2>

        {/* Paquetes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {POKECOIN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pkg.badge && (
                <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded mb-2 inline-block">
                  {pkg.badge}
                </div>
              )}
              <h3 className="font-semibold mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold text-yellow-600 mb-2">
                ${pkg.price}
              </p>
              <p className="text-sm text-gray-600">
                {pkg.pokecoins} Coins
              </p>
              {pkg.bonus && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  +{pkg.bonus} Bonus
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentModal userId="user123" email="user@example.com" onClose={() => {}} />
    </Elements>
  );
}
