import { Request, Response, Router } from "express";
import { CouponController } from "../controllers/CouponController";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middlewares/authenticate";
import { CouponRepository } from "../repositories/CouponRepository";
import { AddCoupon } from "../use_cases/coupon/AddCoupon";
import { DeleteCoupon } from "../use_cases/coupon/DeleteCoupon";
import { UpdateCoupon } from "../use_cases/coupon/UpdateCoupon";
import { GetCoupons } from "../use_cases/coupon/GetCoupons";

const couponRepository = new CouponRepository();
const couponController = new CouponController(
  new AddCoupon(couponRepository),
  new DeleteCoupon(couponRepository),
  new UpdateCoupon(couponRepository),
  new GetCoupons(couponRepository)
);

const router = Router();

// Route to add a new coupon
router.post("/add-coupon", authenticateAdmin, (req: Request, res: Response) => {
  couponController.addCoupon(req, res);
});

// Route to get all coupons
router.get("/get-coupons", authenticateAdmin, (req: Request, res: Response) => {
  couponController.getAllCoupons(req, res);
});

router.get(
  "/get-coupon/:code",
  authenticateUser,
  (req: Request, res: Response) => {
    couponController.findCouponByCode(req, res);
  }
);

// Route to update a coupon
router.put(
  "/update-coupon/:id",
  authenticateAdmin,
  (req: Request, res: Response) => {
    couponController.updateCoupon(req, res);
  }
);

// Route to delete a coupon
router.delete(
  "/delete-coupon/:id",
  authenticateAdmin,
  (req: Request, res: Response) => {
    couponController.deleteCoupon(req, res);
  }
);

// Route to find a coupon by its ID
router.get(
  "/find-coupon/:id",
  authenticateAdmin,
  (req: Request, res: Response) => {
    couponController.findCouponById(req, res);
  }
);

export default router;
