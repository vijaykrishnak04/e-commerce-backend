import { IProduct } from "src/entities/Product";
import { IProductRepository } from "src/repositories/ProductRepository";

export class AddProductUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(productData: IProduct): Promise<IProduct> {
        // Assuming 'add' is the method in your repository to add a new product
        const addedProduct = await this.productRepository.add(productData);
        return addedProduct;
    }
}
