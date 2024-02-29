// src/repositories/ProductRepository.ts

import { Product, IProduct } from "../entities/Product";

export interface IProductRepository {
  add(productData: IProduct): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  findById(productId: string): Promise<IProduct | null>;
  findByCategory(category: string): Promise<IProduct[]>;
  search(query: string): Promise<IProduct[]>;
}

export class ProductRepository implements IProductRepository {
  public async add(productData: IProduct): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  public async findAll(): Promise<IProduct[]> {
    return Product.find().exec();
  }

  public async findById(productId: string): Promise<IProduct | null> {
    return Product.findById(productId).exec();
  }

  public async findByCategory(category: string): Promise<IProduct[]> {
    return Product.find({ category }).exec();
  }

  public async search(query: string): Promise<IProduct[]> {
    return Product.find({
      $text: { $search: query },
    }).exec();
  }
}
