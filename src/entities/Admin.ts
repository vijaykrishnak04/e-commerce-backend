import mongoose, { Document, Schema } from "mongoose";

// Define an interface for Admin document that extends mongoose.Document
export interface IAdmin extends Document {
  email: string;
  password: string;
  roles: string[];
}

// Define the schema for Admin using the new Schema syntax
const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  roles: {
    type: [String],
    default: ["Main-admin"],
  },
});

// Create a model using the interface and schema defined
export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
