import { Request, Response, Router } from "express";
import { BannerController } from "../controllers/BannerController";
import { authenticateAdmin } from "../middlewares/authenticate";
import { BannerRepository } from "../repositories/BannerRepository";
import { uploadFiles } from "../services/cloudinary";
import { AddBanner } from "../use_cases/banner/AddBanner";
import { DeleteBanner } from "../use_cases/banner/DeleteBanner";
import { GetBanner } from "../use_cases/banner/GetBanner";

const bannerController = new BannerController(
  new AddBanner(new BannerRepository()),
  new DeleteBanner(new BannerRepository()),
  new GetBanner(new BannerRepository())
);

const router = Router();

router.post(
  "/add-banner",
  authenticateAdmin,
  uploadFiles,
  (req: Request, res: Response) => {
    bannerController.addBanner(req, res);
  }
);

router.get("/get-banner", (req: Request, res: Response) => {
  bannerController.getBanners(req, res);
});

router.delete(
  "/delete-banner/:id",
  authenticateAdmin,
  (req: Request, res: Response) => {
    bannerController.deleteBanner(req, res);
  }
);

export default router;
