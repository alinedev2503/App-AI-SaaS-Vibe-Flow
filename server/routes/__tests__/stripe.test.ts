import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { stripeWebhookHandler, STRIPE_PRICE_ID_MAP } from '../stripe';
import { getStripe } from '../../src/lib/stripe';
import { getDb } from '../db';

// Mocks
vi.mock('../../src/lib/stripe', () => ({
  getStripe: vi.fn(),
}));
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

describe('stripeWebhookHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Pre-populate mapping for test
    STRIPE_PRICE_ID_MAP['price_test_123'] = 'basico';
  });

  it('should update subscription status when checkout.session.completed is received', async () => {
    const mockDb = { updateUserSubscription: vi.fn() };
    (getDb as any).mockResolvedValue(mockDb);

    const mockStripe = {
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'sess_123',
              client_reference_id: 'user_456',
            }
          }
        }),
      },
      checkout: {
        sessions: {
          listLineItems: vi.fn().mockResolvedValue({
            data: [{ price: { id: 'price_test_123' } }]
          })
        }
      }
    };
    (getStripe as any).mockReturnValue(mockStripe);

    const req = {
      headers: { 'stripe-signature': 'sig' },
      body: Buffer.from('{}'),
    } as unknown as Request;
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn() } as unknown as Response;

    await stripeWebhookHandler(req, res);

    expect(mockDb.updateUserSubscription).toHaveBeenCalledWith('user_456', 'basico');
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
