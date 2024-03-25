import { ICouponRepository } from "../../repositories/CouponRepository";
import mongoose from "mongoose";

export class DeleteCoupon {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(couponId: mongoose.Types.ObjectId): Promise<boolean> {
    return await this.couponRepository.delete(couponId);
  }
}
