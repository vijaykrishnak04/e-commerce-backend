// src/use_cases/product/DeleteProduct.ts

import { deleteFiles } from "../../services/cloudinary";
import { IProductRepository } from "../../repositories/ProductRepository";
import mongoose from "mongoose";

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: mongoose.Types.ObjectId): Promise<Boolean> {
    const product = await this.productRepository.findById(productId)
    const imagesPublicIds = product.images.map(image => image.publicId);
    deleteFiles(imagesPublicIds)
    return this.productRepository.deleteById(productId);
  }
}
