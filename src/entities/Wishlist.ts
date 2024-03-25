import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[]; // Array of product IDs
}

const WishlistSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true }); // Adding timestamps to track when items are added or modified

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
