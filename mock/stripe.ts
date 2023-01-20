import Stripe from "stripe";
import { uuid } from "uuidv4";

const mockStripe = {
  customers: {
    create: (input: any) => {
      return Promise.resolve({
        id: "STRIPE_MOCK_cus_123",
        object: "customer",
        email: input.email,
        ...input,
      } as Stripe.Customer);
    },
    list: (input: any) =>
      Promise.resolve({
        data: [
          { id: "STRIPE_MOCK_cus_123", email: input.email } as Stripe.Customer,
        ],
      }),
  },
  checkout: {
    sessions: {
      retrieve: (sessionId: string) => {
        switch (sessionId) {
          case "expired_session_id":
            return Promise.resolve({
              id: "expired_session_id",
              object: "session",
              status: "expired",
              amount_total: 15 * 499,
              amount_subtotal: 15 * 499,
              currency: "eur",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);

          case "open_stripe_session_id":
            return Promise.resolve({
              id: "open_stripe_session_id",
              object: "session",
              status: "open",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
          case "complete_stripe_session_id":
            return Promise.resolve({
              id: "complete_stripe_session_id",
              object: "session",
              status: "complete",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
          case "109_complete_stripe_session_id":
            return Promise.resolve({
              id: "109_complete_stripe_session_id",
              object: "session",
              status: "complete",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
          case "one_more_complete_stripe_session_id":
            return Promise.resolve({
              id: "one_more_complete_stripe_session_id",
              object: "session",
              status: "complete",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
          case "invalid_session_id":
            return Promise.resolve({
              id: "invalid_session_id",
              object: "session",
              status: "pending",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
          case "correct_amount_and_currency_for_country_deu":
            return Promise.resolve({
              id: "correct_amount_and_currency_for_country_deu",
              object: "session",
              status: "open",
              amount_total: 36 * 499,
              amount_subtotal: 36 * 499,
              currency: "eur",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
          case "not_succeeded_payment_intent_session":
            return Promise.resolve({
              id: "not_succeeded_payment_intent_session",
              object: "session",
              status: "complete",
              amount_total: 36 * 499,
              amount_subtotal: 36 * 499,
              currency: "eur",
              payment_intent: "STRIPE_MOCK_pi_not_succeeded",
            } as unknown as Stripe.Checkout.Session);
          default:
            return Promise.resolve({
              id: "session_id",
              object: "session",
              status: "complete",
              amount_total: 36 * 499,
              amount_subtotal: 36 * 499,
              currency: "eur",
              payment_intent: "STRIPE_MOCK_pi_123",
            } as unknown as Stripe.Checkout.Session);
        }
      },
      create: (input: any) =>
        Promise.resolve({
          id: `STRIPE_MOCK_cs_${uuid()}`,
          status: "open",
          amount_total: 5990,
          amount_subtotal: 5990,
          currency: "eur",
          payment_intent: "STRIPE_MOCK_pi_123",
          ...input,
        } as Stripe.Checkout.Session),
    },
  },
  paymentIntents: {
    create: (input: any) =>
      Promise.resolve({
        id: `STRIPE_MOCK_pi_${uuid()}`,
      } as Stripe.PaymentIntent),
    retrieve: (paymentIntent: string) => {
      switch (paymentIntent) {
        case "STRIPE_MOCK_pi_not_succeeded":
          return Promise.resolve({
            id: "STRIPE_MOCK_pi_not_succeeded",
            status: "requires_payment_method",
          } as unknown as Stripe.PaymentIntent);
        default:
          return Promise.resolve({
            id: "STRIPE_MOCK_pi_123",
            status: "succeeded",
            payment_method: "STRIPE_MOCK_pm_1GXq7q6LZvWqJZxqQXwqXwq",
          } as Stripe.PaymentIntent);
      }
    },
  },
  setupIntents: {
    create: (input: any) =>
      Promise.resolve({ id: "STRIPE_MOCK_si_123" } as Stripe.SetupIntent),
    retrieve: (input: any) =>
      Promise.resolve({ id: "STRIPE_MOCK_si_123" } as Stripe.SetupIntent),
  },
};

export default mockStripe;
