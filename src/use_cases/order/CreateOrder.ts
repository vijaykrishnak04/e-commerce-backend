import Razorpay from "razorpay";
import { IOrderRepository } from "../../repositories/OrderRepository";
import { ICouponRepository } from "../../repositories/CouponRepository";
import { ICartRepository } from "../../repositories/CartRepository";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private couponRepository: ICouponRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(orderData: any) {
    try {
      console.log(orderData);
      if (orderData.paymentMethod === "stripe") {
        const { client_secret, id } = await this.createStripePaymentIntent(
          orderData.totalPrice,
          orderData.userMail
        );
        console.log(client_secret);

        orderData.paymentDetails = {
          sessionId: id,
          paymentIntentId: client_secret,
          paymentGateway: "Stripe",
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
      if (Array.isArray(orderData.items) && orderData.items.length > 0 && cart?.items.length) {
        const orderItemIds = orderData.items
          .map((item: any) => item._id?.toString())
          .filter((id: any) => id !== undefined);

        // Filter out the items from the cart that are present in `orderData.items`
        const updatedItems = cart.items.filter(
          (cartItem) => !orderItemIds.includes(cartItem._id.toString())
        );
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

  private async createStripePaymentIntent(
    amount: number,
    customerEmail: string
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        customer_email: customerEmail, // Dynamic email
        submit_type: "pay",
        phone_number_collection: {
          enabled: true,
        },
        billing_address_collection: "auto",
        line_items: [
          {
            price_data: {
              currency: "usd", // Adjust to your desired currency
              product_data: {
                name: "Total Amount",
              },
              unit_amount: amount * 100, // Convert amount to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        redirect_on_completion: "never",
      });
      return session;
    } catch (error) {
      console.error("Failed to create Stripe payment intent", error);
      throw new Error("Failed to initiate payment");
    }
  }
}
