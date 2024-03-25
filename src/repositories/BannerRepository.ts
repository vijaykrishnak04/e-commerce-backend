import mongoose from "mongoose";
import { Banner, IBanner } from "../entities/Banner";

export interface IBannerRepository {
  findAll(): Promise<IBanner[]>;
  create(bannerData: Partial<IBanner>): Promise<IBanner>;
  delete(bannerId: mongoose.Types.ObjectId): Promise<Boolean>;
  update(bannerData: IBanner): Promise<IBanner>;
}

export class BannerRepository implements IBannerRepository {
  public async findAll(): Promise<IBanner[]> {
    return await Banner.find().exec();
  }
  public async create(bannerData: IBanner): Promise<IBanner> {
    const banner = new Banner(bannerData);
    await banner.save();
    return banner;
  }
  public async delete(bannerId: mongoose.Types.ObjectId): Promise<Boolean> {
    const result = await Banner.deleteOne({ _id: bannerId }).exec();
    return result.deletedCount > 0;
  }
  public async update(bannerData: IBanner): Promise<IBanner> {
    throw new Error("Method not implemented.");
  }
}
