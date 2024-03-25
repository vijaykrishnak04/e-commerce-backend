import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Coupon document
export interface ICoupon extends Document {
  couponCode: string;
  discountPercentage: number;
  maxLimit: number;
  expiryDate: Date;
  users: string[];
}

// Define the schema for Coupon, incorporating the interface
const couponSchema: Schema<ICoupon> = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    maxLimit: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    users: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Create a model for Coupon using the interface and schema defined
export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
