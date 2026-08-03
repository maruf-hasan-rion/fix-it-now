import type Stripe from "stripe";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import config from "../../config";

const createPaymentIntentIntoDB = async (
  bookingId: string,
  userId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking is not accepted yet"
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingPayment?.status === PaymentStatus.SUCCESS) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking already paid"
    );
  }

  let paymentIntent: Stripe.PaymentIntent;

  // Reuse existing pending PaymentIntent
  if (
    existingPayment &&
    existingPayment.status === PaymentStatus.PENDING
  ) {
    paymentIntent = await stripe.paymentIntents.retrieve(
      existingPayment.transactionId
    );
  } else {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.service.price * 100),
      currency: "bdt",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: booking.id,
      },
    });

    await prisma.payment.upsert({
      where: {
        bookingId,
      },
      update: {
        transactionId: paymentIntent.id,
        amount: booking.service.price,
        status: PaymentStatus.PENDING,
      },
      create: {
        bookingId,
        transactionId: paymentIntent.id,
        amount: booking.service.price,
        status: PaymentStatus.PENDING,
      },
    });
  }

  return {
    paymentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret!,
  };
};
const handleWebhook = async (payload: Buffer, signature: string) => {
    console.log("Webhook received");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret,
    );

    console.log("Event:", event.type);
  } catch (err) {
    console.log(err);
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid webhook signature");
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("Payment succeeded event");
      await paymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
  }
};

const paymentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {
  console.log("Webhook PaymentIntent:", paymentIntent.id);

  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: paymentIntent.id,
    },
  });

  console.log("Found Payment:", payment);

  if (!payment) return;

  if (payment.status === PaymentStatus.SUCCESS) {
    console.log("Already paid");
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PaymentStatus.SUCCESS,
          paidAt: new Date(),
        },
      });

      console.log("Payment updated");

      await tx.booking.update({
        where: {
          id: payment.bookingId,
        },
        data: {
          status: BookingStatus.PAID,
        },
      });

      console.log("Booking updated");
    });

    console.log("Transaction completed");
  } catch (err) {
    console.error(err);
  }
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
export const PaymentService = {
  createPaymentIntentIntoDB,
  handleWebhook,
  //   paymentSuccess,
  getMyPayments,
};
