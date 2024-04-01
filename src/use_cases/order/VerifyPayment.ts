import mongoose from "mongoose";
import { IOrderRepository } from "../../repositories/OrderRepository";
import { IOrder } from "src/entities/Order";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class VerifyPaymentUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(
    paymentIntentId: string,
    id: mongoose.Types.ObjectId
  ): Promise<IOrder> {
    try {
      const paymentIntent = await stripe.checkout.sessions.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status === "complete") {
        // Payment was successful, update order as verified
        const updatedOrder = await this.orderRepository.updatePaymentStatus(
          id,
          "Completed"
        );
        return updatedOrder;
      } else {
        await this.orderRepository.updatePaymentStatus(id, "Failed");
        // Handle other statuses accordingly or throw an error if the payment was not successful
        throw new Error("Payment not successful");
      }
    } catch (error) {
      console.error("Payment verification failed", error);
      throw new Error("Payment verification failed");
    }
  }
}
