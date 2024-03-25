import { IBanner } from "src/entities/Banner";
import { IBannerRepository } from "../../repositories/BannerRepository";

export class GetBanner {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(): Promise<IBanner[]> {
    return await this.bannerRepository.findAll();
  }
}
