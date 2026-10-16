import Stripe from "stripe";
let stripeClient: Stripe | null = null;
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local.");
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
}
export function priceIdForSlug(slug: string) {
  const map: Record<string, string | undefined> = { starter: undefined, pro: process.env.STRIPE_PRICE_PRO, business: process.env.STRIPE_PRICE_BUSINESS };
  return map[slug];
}
