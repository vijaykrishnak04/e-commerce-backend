import mongoose from "mongoose";
import { Banner } from "src/entities/Banner";
import { IBannerRepository } from "../../repositories/BannerRepository";
import { deleteFiles } from "../../services/cloudinary";

export class DeleteBanner {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(
    bannerId: mongoose.Types.ObjectId,
    publicId: string
  ): Promise<Boolean> {
    deleteFiles([publicId]);
    return await this.bannerRepository.delete(bannerId);
  }
}
