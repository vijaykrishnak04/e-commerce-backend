import { IProduct } from "src/entities/Product";
import { IProductRepository } from "src/repositories/ProductRepository";

export class ViewProduct{
    constructor( private productRepository: IProductRepository) {}

    async execute(id: string): Promise<IProduct> {
        return this.productRepository.findById(id)
    }
}