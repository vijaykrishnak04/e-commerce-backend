import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Banner document that extends mongoose.Document
export interface IBanner extends Document {
  imageUrl: string;
  publicId: string;
}

// Define the schema for Banner using the new Schema syntax and including timestamps
const BannerSchema: Schema<IBanner> = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model using the interface and schema defined
export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
