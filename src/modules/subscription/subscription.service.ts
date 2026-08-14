import { Stripe } from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/client";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "../../utils/subscription.utils";

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

// stripe subscriptions cancel sub_1U3ACVJhK2ZyCrqgCmV6zGVF
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

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExits = await prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });

  const isActive =
    isSubscriptionExits.status === "ACTIVE" &&
    isSubscriptionExits.currentPeriodEnd &&
    new Date(isSubscriptionExits.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionExits.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExits.currentPeriodEnd,
  };
};

export const subscriptionServices = {
  createSubscriptionSession,
  webhook,
  getSubscriptionStatus
};
