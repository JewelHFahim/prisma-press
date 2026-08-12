import { Stripe } from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/client";

const createSubscriptionSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    //old subscriber from db
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // new subscriber create
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });

  return {
    paymanetUrl: transactionResult,
  };
};

const webhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);

      break;
    case "customer.subscription.updated":
      await handleChangeSubscription(event.data.object);

      break;
    case "customer.subscription.deleted":
      await handleChangeSubscription(event.data.object);

      break;
    default:
      // Unexpected event type
      console.log(`No event matched. Unhandled event type ${event.type}.`);
  }
};

const getTimePeriode = (payload: Stripe.Subscription) => {
  const currentPeriodEndINMilSec = payload.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndINMilSec * 1000);

  return currentPeriodEnd;
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId!;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log(`Webhook: Missing values for creating Stripe Checkout`);

    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const currentPeriodEnd = getTimePeriode(stripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },

    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

const handleChangeSubscription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;

  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELD
        : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = getTimePeriode(payload);

  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });

  if (!isSubscriptionExist) {
    console.log(
      `Webhook: No subscription found for subscription id: ${stripeSubscriptionId}`,
    );

    return;
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};

export const subscriptionServices = {
  createSubscriptionSession,
  webhook,
};
