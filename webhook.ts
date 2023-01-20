import { paymentAuthorization } from "./functions/subscription";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
export const handler = async (event, context, callback) => {
  let stripeEvent;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = event.headers["Stripe-Signature"];
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      callback(null, {
        statusCode: 400,
        error: `Webhook signature verification failed. ${err.message}`,
      });
    }
  }

  const checkoutSessionCompletionHandler = async (sessionId: string) => {
    try {
      const response = await paymentAuthorization(sessionId);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  // Handle the stripeEvent
  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      const paymentIntent = stripeEvent.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      //TODO: handle this case when payment is successful
      break;
    case "checkout.session.completed":
      const sessionId = stripeEvent.data.object.id;
      await checkoutSessionCompletionHandler(sessionId);
      console.log(
        `checkout session for session id ${sessionId} was successful!`
      );
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled stripeEvent type ${stripeEvent.type}.`);
  }

  const data = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Webhook received: ${stripeEvent.type}`,
    }),
  };
  return data;
};
