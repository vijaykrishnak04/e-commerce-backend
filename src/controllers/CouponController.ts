import { Request, Response } from "express";
import mongoose from "mongoose";
import { AddCoupon } from "../use_cases/coupon/AddCoupon";
import { DeleteCoupon } from "../use_cases/coupon/DeleteCoupon";
import { UpdateCoupon } from "../use_cases/coupon/UpdateCoupon";
import { GetCoupons } from "../use_cases/coupon/GetCoupons";

export class CouponController {
  constructor(
    private addCouponUseCase: AddCoupon,
    private deleteCouponUseCase: DeleteCoupon,
    private updateCouponUseCase: UpdateCoupon,
    private getAllCouponsUseCase: GetCoupons
  ) {}

  public async addCoupon(req: Request, res: Response): Promise<Response> {
    try {
      const couponData = req.body;
      const coupon = await this.addCouponUseCase.execute(couponData);
      return res.status(201).json(coupon);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Failed to add coupon: " + error.message });
    }
  }

  public async deleteCoupon(req: Request, res: Response): Promise<Response> {
    try {
      const couponId = new mongoose.Types.ObjectId(req.params.id);
      await this.deleteCouponUseCase.execute(couponId);
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Failed to delete coupon: " + error.message });
    }
  }

  public async updateCoupon(req: Request, res: Response): Promise<Response> {
    try {
      const couponId = new mongoose.Types.ObjectId(req.params.id);
      const couponData = req.body;
      const updatedCoupon = await this.updateCouponUseCase.execute(
        couponId,
        couponData
      );
      return res.status(200).json(updatedCoupon);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Failed to update coupon: " + error.message });
    }
  }

  public async getAllCoupons(req: Request, res: Response): Promise<Response> {
    try {
      const coupons = await this.getAllCouponsUseCase.getAllCoupons();
      return res.status(200).json(coupons);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Failed to get coupons: " + error.message });
    }
  }

  public async findCouponById(req: Request, res: Response): Promise<Response> {
    try {
      const couponId = new mongoose.Types.ObjectId(req.params.id);
      const coupon = await this.getAllCouponsUseCase.getCouponById(couponId);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json(coupon);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Failed to find coupon: " + error.message });
    }
  }

  public async findCouponByCode(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      // Extracting the coupon code from the URL params
      const couponCode = req.params.code;

      // Now, also extracting the user's email from the query parameters
      const userEmail = req.query.email as string; // Casting to string since query parameters are of type any

      // Just for demonstration, let's log the email to see it's being captured
      console.log(
        `Received request for coupon code: ${couponCode} with email: ${userEmail}`
      );

      // Your existing logic to fetch the coupon using the coupon code
      const coupon = await this.getAllCouponsUseCase.getCouponByCode(
        couponCode
      );
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      // You could use `userEmail` here to further customize your logic
      // For example, checking if the coupon is valid for the user, etc.

      return res.status(200).json(coupon);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Failed to find coupon: " + error.message });
    }
  }
}
