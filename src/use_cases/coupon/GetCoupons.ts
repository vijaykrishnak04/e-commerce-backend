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

  async getCouponByCode(couponCode: string): Promise<ICoupon | null> {
    return await this.couponRepository.findByCouponCode(couponCode);
  }
}
