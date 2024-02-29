import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Order document
export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  orderDate: Date;
  totalAmount: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryDate?: Date;
}

// Define the schema for Order, incorporating the interface
const orderSchema: Schema<IOrder> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending',
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
    required: true,
  },
  deliveryDate: Date,
});

// Create a model for Order using the interface and schema defined
export const Order = mongoose.model<IOrder>('Order', orderSchema);
