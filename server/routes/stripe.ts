import { Router, Request, Response } from "express";
import { getStripe } from "../../src/lib/stripe";
import { getDb } from "../db";
import Stripe from "stripe";
import { getPlanFromPriceId } from "../services/stripe";

const router = Router();

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).send("Webhook secret missing");
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    
    // Obtém o line_item para pegar o price_id
    const lineItems = await getStripe().checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    if (userId && priceId) {
      const planTier = getPlanFromPriceId(priceId);
      if (planTier) {
        const db = await getDb();
        await db.updateUserSubscriptionTier(userId, planTier);
      }
    }
  }

  res.json({ received: true });
};

router.post("/setup-plans", async (req, res) => {
  try {
    const stripe = getStripe();
    const plans = [
      { name: "Básico", price: 3900, id: "basic" },
      { name: "Pro", price: 9700, id: "pro" },
      { name: "Plano Enterprise", price: 29700, id: "enterprise" },
    ];

    const results = await Promise.all(plans.map(async (plan) => {
      const product = await stripe.products.create({
        name: plan.name,
        metadata: { planId: plan.id }
      });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: 'brl',
        recurring: { interval: 'month' },
      });
      // Retorna o ID do preço junto com o plano
      return { planId: plan.id, priceId: price.id };
    }));

    res.json({ message: "Planos criados", results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
