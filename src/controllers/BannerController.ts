import { Request, Response } from "express";
import mongoose from "mongoose";
import { AddBanner } from "../use_cases/banner/AddBanner";
import { DeleteBanner } from "../use_cases/banner/DeleteBanner";
import { GetBanner } from "../use_cases/banner/GetBanner";
import { deleteFiles } from "../services/cloudinary";

export class BannerController {
  constructor(
    private AddBanner: AddBanner,
    private DeleteBanner: DeleteBanner,
    private GetBanner: GetBanner
  ) {}

  public async addBanner(req: Request, res: Response): Promise<Response> {
    try {
      const bannerData = req.files;
      const banner = await this.AddBanner.execute(bannerData);
      return res.status(200).json(banner);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async deleteBanner(req: Request, res: Response): Promise<Response> {
    try {
      const bannerId = new mongoose.Types.ObjectId(req.params.id);
      const { publicId } = req.body;
      const result = await this.DeleteBanner.execute(bannerId, publicId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async getBanners(req: Request, res: Response): Promise<Response> {
    try {
      const banners = await this.GetBanner.execute();
      return res.status(200).json(banners);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
