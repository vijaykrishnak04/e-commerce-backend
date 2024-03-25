import Razorpay from "razorpay";
import { IOrderRepository } from "../../repositories/OrderRepository";
import { ICouponRepository } from "../../repositories/CouponRepository";
import { ICartRepository } from "../../repositories/CartRepository";

export class CreateOrderUseCase {
  private razorpayInstance: Razorpay;

  constructor(
    private orderRepository: IOrderRepository,
    private couponRepository: ICouponRepository,
    private cartRepository: ICartRepository
  ) {
    this.razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY, // Ensure these are set in your environment
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }

  async execute(orderData: any) {
    try {
      console.log(orderData);

      if (orderData.paymentMethod === "razorpay") {
        const razorpayOrder = await this.createRazorpayOrder(
          orderData.totalPrice
        );
        orderData.paymentDetails = {
          orderId: razorpayOrder.id,
          paymentGateway: "Razorpay",
        };
      } else if (orderData.paymentMethod === "Cash on Delivery") {
        orderData.orderStatus = "Placed";
        // No need to create a Razorpay order for COD
      }

      // Save the order with either Razorpay details or as a COD order
      const newOrder = await this.orderRepository.create({
        ...orderData,
      });

      if (orderData.couponCode) {
        this.couponRepository.addUserToCoupon(
          orderData.couponCode,
          orderData.userMail
        );
      }

      // Assuming `orderData` is available in your context and it contains an array of item objects in `items`
      const cart = await this.cartRepository.findByUserId(orderData.userId);

      // First, ensure orderData.items is an array and has elements
      if (Array.isArray(orderData.items) && orderData.items.length > 0) {
        const orderItemIds = orderData.items
          .map((item: any) => item._id?.toString())
          .filter((id: any) => id !== undefined);

        // Filter out the items from the cart that are present in `orderData.items`
        const updatedItems = cart.items.filter(
          (cartItem) => !orderItemIds.includes(cartItem._id.toString())
        );

        console.log(updatedItems);

        // Update the cart in the repository with the filtered items
        await this.cartRepository.updateById(cart._id, { items: updatedItems });
      } else {
        // Handle the case where orderData.items is not as expected
        console.error("orderData.items is not an array or is empty");
        // Consider how you want to handle this scenario - perhaps return an error response or similar
      }

      return newOrder;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create order");
    }
  }

  private async createRazorpayOrder(amount: number) {
    const options = {
      amount: amount * 100, // Convert to the smallest currency unit
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1,
    };

    try {
      const order = await this.razorpayInstance.orders.create(options);
      return order;
    } catch (error) {
      throw new Error("Failed to create Razorpay order");
    }
  }
}
