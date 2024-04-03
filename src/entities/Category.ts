import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Category document that includes subcategories
export interface ICategory extends Document {
  categoryName: string;
  feature: boolean;
  categoryImage: {
    url: string;
    publicId: string;
  };
  bannerImage?: {
    url: string;
    publicId: string;
  };
  subcategories: string[];
}

// Define the schema for Category, including the subcategorySchema
const categorySchema: Schema<ICategory> = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    feature: {
      type: Boolean,
      default: false,
    },
    categoryImage: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    bannerImage: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    subcategories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Create a model for Category using the interface and schema defined
export const Category = mongoose.model<ICategory>("Category", categorySchema);
