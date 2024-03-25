import { Banner, IBanner } from "../../entities/Banner";
import { IBannerRepository } from "../../repositories/BannerRepository";

export class AddBanner {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(bannerData: any): Promise<IBanner> {
    const { filename, path } = bannerData[0];
    const banner = {
      imageUrl: path,
      publicId: filename
    }
    return await this.bannerRepository.create(banner);
  }
}
