import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Subcategory document
export interface ISubcategory extends Document {
  subcategoryName: string;
  subcategoryImage: {
    url: string;
    publicId: string;
  };
}

// Define the schema for Subcategory
const subcategorySchema: Schema<ISubcategory> = new Schema({
  subcategoryName: {
    type: String,
    required: true,
  },
  subcategoryImage: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
});

// Define an interface for the Category document that includes subcategories
export interface ICategory extends Document {
  categoryName: string;
  categoryImage: {
    url: string;
    publicId: string;
  };
  subcategories: ISubcategory[];
}

// Define the schema for Category, including the subcategorySchema
const categorySchema: Schema<ICategory> = new Schema({
  categoryName: {
    type: String,
    required: true,
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
  subcategories: [subcategorySchema],
}, { timestamps: true });

// Create a model for Category using the interface and schema defined
export const Category = mongoose.model<ICategory>('Category', categorySchema);
