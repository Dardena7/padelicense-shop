import crypto from "node:crypto";

/**
 * Simulates a Stripe webhook in environments where `stripe listen` is not available (CI).
 *
 * Reproduces exactly what Stripe does:
 * 1. Build the event payload (payment_intent.succeeded)
 * 2. Sign it with HMAC-SHA256 using the webhook secret
 * 3. POST to the API webhook endpoint with the Stripe-Signature header
 *
 * Only runs when STRIPE_WEBHOOK_SECRET is set (CI).
 * In local dev, stripe listen handles webhooks automatically.
 */
export const simulatePaymentSucceeded = async (orderUuid: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return;
  }

  const payload = JSON.stringify({
    id: `evt_ci_${Date.now()}`,
    type: "payment_intent.succeeded",
    data: {
      object: {
        id: `pi_ci_${Date.now()}`,
        object: "payment_intent",
        metadata: { order_uuid: orderUuid },
      },
    },
  });

  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  const sigHeader = `t=${timestamp},v1=${signature}`;

  await fetch("http://localhost:3000/webhooks/stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Stripe-Signature": sigHeader,
    },
    body: payload,
  });
};
