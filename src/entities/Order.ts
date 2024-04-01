import mongoose, { Document, Schema } from "mongoose";

interface IShippingDetails {
  provider: string; // Shipping provider (e.g., UPS, FedEx)
  url: string; // Shipping provider (e.g., UPS, FedEx)
  trackingNumber?: string; // Shipping tracking number
  shippingStatus: "Not Shipped" | "Shipped" | "In Transit" | "Delivered"; // Current status of the shipment
}
interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId | string; // Flexible product ID representation
  quantity: number;
  productName: string;
  selectedColor?: string;
  selectedSize?: string;
  productPrice: number;
  image?: {
    url: string;
    publicId: string;
  }; // Nested object for image details
  shippingDetails?: IShippingDetails;
}

interface IOrderCancellationReturn {
  isCancelled: boolean;
  isReturned: boolean;
  cancelledBy: "user" | "seller";
  reason?: string; // Reason for cancellation or return
  date: Date; // Date of cancellation or return
}

interface IPaymentDetails {
  sessionId?: string;
  paymentIntentId: string; // Unique identifier for the payment transaction
  paymentGateway: string; // The payment gateway used (e.g., Stripe, PayPal)
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  address: {
    fullname: string;
    street: string;
    landmark?: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
    phone: number;
  };
  orderStatus: "Pending" | "Placed" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod: "Credit Card" | "Debit Card" | "stripe" | "Cash on Delivery";
  paymentDetails: IPaymentDetails;
  deliveryDate: Date;
  totalPrice: number;
  cancellationReturnDetails?: IOrderCancellationReturn;
}

const ShippingDetailsSchema: Schema<IShippingDetails> = new Schema(
  {
    provider: { type: String, required: true },
    trackingNumber: { type: String },
    url: { type: String},
    shippingStatus: {
      type: String,
      enum: ["Not Shipped", "Shipped", "In Transit", "Delivered"],
      default: "Not Shipped",
    },
  },
  { _id: false }
);

const orderItemSchema: mongoose.Schema<IOrderItem> = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to a separate Product model (if applicable)
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1."],
      default: 1,
    },
    productName: {
      type: String,
    },
    selectedColor: {
      type: String,
    },
    selectedSize: {
      type: String,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.Mixed, // Allow flexibility for image storage
      default: {}, // Set a default empty object for image
    },
    shippingDetails: ShippingDetailsSchema,
  },
  { _id: false }
);

const AddressSchema: Schema = new Schema(
  {
    fullname: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  { _id: false }
);

const PaymentDetailsSchema: Schema<IPaymentDetails> = new Schema(
  {
    sessionId: { type: String },
    paymentIntentId: { type: String, required: true },
    paymentGateway: { type: String, required: true },
  },
  { _id: false }
);

const OrderCancellationReturnSchema: Schema<IOrderCancellationReturn> =
  new Schema(
    {
      isCancelled: { type: Boolean, default: false },
      isReturned: { type: Boolean, default: false },
      cancelledBy: {
        type: String,
        enum: ["user", "seller"],
        required: true,
      },
      reason: { type: String, required: true },
    },
    { timestamps: true }
  );

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    address: AddressSchema,
    orderStatus: {
      type: String,
      enum: ["Pending", "Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "stripe", "Cash on Delivery"],
      required: true,
    },
    paymentDetails: PaymentDetailsSchema,
    deliveryDate: {
      type: Date,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    cancellationReturnDetails: OrderCancellationReturnSchema,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
