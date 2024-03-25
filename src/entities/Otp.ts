import mongoose, { Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: number;
  expirationTime: Date;
}

// The actual schema and model would remain unchanged
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
    expires: 180 // assuming you want the OTP to expire in 180 seconds
  },
}, {
  timestamps: true,
});

const Otp = mongoose.model<IOtp>('Otp', otpSchema);
export default Otp;
