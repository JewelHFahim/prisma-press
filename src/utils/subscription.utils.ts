import { Stripe } from "stripe";
import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/client";

export const getTimePeriode = (payload: Stripe.Subscription) => {
  const currentPeriodEndINMilSec = payload.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndINMilSec * 1000);

  return currentPeriodEnd;
};

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
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

export const handleChangeSubscription = async (payload: Stripe.Subscription) => {
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
