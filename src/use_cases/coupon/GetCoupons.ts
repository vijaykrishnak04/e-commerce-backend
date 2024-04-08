import mongoose from "mongoose";
import { ICoupon } from "../../entities/Coupon";
import { ICouponRepository } from "../../repositories/CouponRepository";

export class GetCoupons {
  constructor(private couponRepository: ICouponRepository) {}

  async getAllCoupons(): Promise<ICoupon[]> {
    return await this.couponRepository.findAll();
  }

  async getCouponById(
    couponId: mongoose.Types.ObjectId
  ): Promise<ICoupon | null> {
    return await this.couponRepository.findById(couponId);
  }

  async getCouponByCode(
    couponCode: string,
    userEmail: string
  ): Promise<ICoupon | null> {
    // Retrieve the coupon from the database
    const coupon = await this.couponRepository.findByCouponCode(couponCode);

    // If the coupon is not found, return null
    if (!coupon) {
      return null;
    }

    // Check if the user's email is already in the coupon's users array
    const isUserAlreadyUsedCoupon = coupon.users.includes(userEmail);

    // If the user's email is found in the array, return a message indicating that the coupon has already been used
    if (isUserAlreadyUsedCoupon) {
      throw new Error("Coupon is already used.");
    }

    delete coupon.users;
    // Otherwise, return the coupon object
    return coupon;
  }
}
