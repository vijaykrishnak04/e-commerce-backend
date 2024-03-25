import mongoose from "mongoose";
import { IOrderRepository } from "../../repositories/OrderRepository";
import crypto from "crypto";
import { IOrder } from "src/entities/Order";

export class VerifyPaymentUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(
    paymentId: string,
    orderId: string,
    signature: string,
    id: mongoose.Types.ObjectId
  ): Promise<IOrder> {
    const secret = process.env.RAZORPAY_SECRET;

    // Generate the signature to compare with the one Razorpay sent
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (signature === generatedSignature) {
      // Signature matches, update order as verified
      const updatedOrder = await this.orderRepository.updatePaymentStatus(
        id,
        "Completed",
        paymentId
      );
      return updatedOrder;
    } else {
      throw new Error("Payment verification failed");
    }
  }
}
