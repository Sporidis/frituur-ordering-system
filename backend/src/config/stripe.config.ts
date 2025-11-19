import * as dotenv from 'dotenv';
dotenv.config();

export const stripeConfig = {
  secretKey:
    process.env.STRIPE_SECRET_KEY ||
    'sk_test_your_stripe_test_secret_key_in_the_env_file',
  publishableKey:
    process.env.STRIPE_PUBLISHABLE_KEY ||
    'pk_test_your_stripe_test_publishable_key_in_the_env_file',

  // Stripe configuration
  apiVersion: '2025-10-29.clover' as const,
  currency: 'eur',

  // Test card numbers for development
  testCards: {
    visa: '4242424242424242',
    visaDebit: '4000056655665556',
    mastercard: '5555555555554444',
    amex: '378282246310005',
    declined: '4000000000000002',
    insufficientFunds: '4000000000009995',
  },
};
