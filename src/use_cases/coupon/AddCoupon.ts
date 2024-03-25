import { ICoupon, Coupon } from "../../entities/Coupon";
import { ICouponRepository } from "../../repositories/CouponRepository";

export class AddCoupon {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(couponData: Partial<ICoupon>): Promise<ICoupon> {
    // Validate couponData here if necessary
    const couponExist = await this.couponRepository.findByCouponCode(
      couponData.couponCode
    );

    if (couponExist) {
      throw new Error("Coupon with this name already exist");
    } else {
      return await this.couponRepository.create(couponData);
    }
  }
}
