import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Address Schema
const AddressSchema: Schema = new Schema(
  {
    fullname: { type: String, requierd: true },
    buildingNo: { type: String, required: true },
    street: { type: String, required: true },
    zone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  { _id: false }
); // _id: false since it's a subdocument

export interface IUser extends Document {
  username: string;
  password: string;
  phone: {
    code: string;
    number: number;
  };
  email: string;
  roles: string[];
  address: {
    fullname: string;
    buildingNo: string;
    street: string;
    zone: string;
    city: string;
    state: string;
    phone: number;
  }[];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },

    phone: {
      code: { type: String, required: true },
      number: { type: Number, required: true },
    },
    email: { type: String, required: true },
    roles: {
      type: [String],
      default: ["user"],
    },
    address: [AddressSchema], // Users can have multiple addresses
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
