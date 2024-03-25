import mongoose from "mongoose";
import { Coupon, ICoupon } from "../entities/Coupon";

export interface ICouponRepository {
  findAll(): Promise<ICoupon[]>;
  create(couponData: Partial<ICoupon>): Promise<ICoupon>;
  delete(couponId: mongoose.Types.ObjectId): Promise<boolean>;
  update(
    couponId: mongoose.Types.ObjectId,
    couponData: Partial<ICoupon>
  ): Promise<ICoupon>;
  findById(couponId: mongoose.Types.ObjectId): Promise<ICoupon | null>;
  findByCouponCode(couponCode: string): Promise<ICoupon | null>; // Add this line
  addUserToCoupon(
    couponId: mongoose.Types.ObjectId,
    userEmail: string
  ): Promise<void>;
}

export class CouponRepository implements ICouponRepository {
  public async findAll(): Promise<ICoupon[]> {
    return await Coupon.find().exec();
  }

  public async create(couponData: Partial<ICoupon>): Promise<ICoupon> {
    const coupon = new Coupon(couponData);
    await coupon.save();
    return coupon;
  }

  public async delete(couponId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await Coupon.deleteOne({ _id: couponId }).exec();
    return result.deletedCount > 0;
  }

  public async update(
    couponId: mongoose.Types.ObjectId,
    couponData: Partial<ICoupon>
  ): Promise<ICoupon> {
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, couponData, {
      new: true,
    }).exec();
    if (!updatedCoupon) {
      throw new Error("Coupon not found");
    }
    return updatedCoupon;
  }

  public async findById(
    couponId: mongoose.Types.ObjectId
  ): Promise<ICoupon | null> {
    return await Coupon.findById(couponId).exec();
  }

  public async findByCouponCode(couponCode: string): Promise<ICoupon | null> {
    return await Coupon.findOne({ couponCode: couponCode }).exec();
  }

  async addUserToCoupon(
    couponId: mongoose.Types.ObjectId,
    userEmail: string
  ): Promise<void> {
    await Coupon.findByIdAndUpdate(
      couponId,
      { $addToSet: { users: userEmail } } // Use $addToSet to avoid duplicates
    );
  }
}
