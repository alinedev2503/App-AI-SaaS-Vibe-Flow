export const STRIPE_PRICE_ID_MAP: Record<string, string> = {
  // Substitua pelos IDs de preço reais após rodar /setup-plans
  'price_basico_id': 'basic',
  'price_pro_id': 'pro',
  'price_plus_id': 'enterprise',
};

export const getPlanFromPriceId = (priceId: string): string | undefined => {
  return STRIPE_PRICE_ID_MAP[priceId];
};
