import mongoose, { Document, Schema } from "mongoose";

// Define an interface for Specification nested in Product
interface ISpecification {
  title?: string;
  description?: string;
}

// Define an interface for Image nested in Product
interface IImage {
  url: string;
  publicId: string;
}

// Define an interface for the Product document
export interface IProduct extends Document {
  productName: string;
  productPrice: number;
  stock: number;
  productDescription: string;
  productType: string;
  brand: string;
  colors: string[];
  category: string;
  subcategory: string[];
  deliveryTime: "In Stock" | "Arranging Stock" | "Out Of Stock";
  size?: string[];
  sizeType?: string;
  specifications: ISpecification[];
  images: IImage[];
}

// Define the schema for Product, incorporating the interfaces
const productSchema: Schema<IProduct> = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  colors: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  subcategory: [
    {
      type: String,
      required: true,
    },
  ],
  deliveryTime: {
    type: String,
    enum: ["In Stock", "Arranging Stock", "Out Of Stock"],
    default: "In Stock",
    required: true,
  },
  size: [
    {
      type: String,
    },
  ],
  sizeType: { type: String },
  specifications: [
    {
      title: String,
      description: String,
    },
  ],
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create a model for Product using the interface and schema defined
export const Product = mongoose.model<IProduct>("Product", productSchema);
