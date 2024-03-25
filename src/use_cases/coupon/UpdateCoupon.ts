import { ICoupon, Coupon } from "../../entities/Coupon";
import { ICouponRepository } from "../../repositories/CouponRepository";
import mongoose from "mongoose";

export class UpdateCoupon {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(couponId: mongoose.Types.ObjectId, couponData: Partial<ICoupon>): Promise<ICoupon> {
    return await this.couponRepository.update(couponId, couponData);
  }
}
