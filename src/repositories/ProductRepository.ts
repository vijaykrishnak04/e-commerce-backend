// src/repositories/ProductRepository.ts

import mongoose from "mongoose";
import { Product, IProduct } from "../entities/Product";
import { CURRENCY_SYMBOL } from "../utils/constants";

// Define filter and sorting interfaces for better type safety
interface IAvailableFilters {
  size: Array<{ value: string; label: string; selected: boolean }>;
  brand: Array<{ value: string; label: string; selected: boolean }>;
  colors: Array<{ value: string; label: string; selected: boolean }>;
  price: Array<{ value: string; label: string; selected: boolean }>;
}

interface IAvailableSorts {
  sortLabel: string;
  sortKey: string;
  selected: boolean;
}

export interface IProductRepository {
  add(productData: IProduct): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  findById(productId: mongoose.Types.ObjectId): Promise<IProduct | null>;
  findNew(): Promise<IProduct[]>;
  findByName(productName: string): Promise<IProduct | null>;
  findByCategory(filters: any): Promise<{
    totalProducts: number;
    products: IProduct[];
    availableFilters: IAvailableFilters;
    availableSorts: IAvailableSorts[];
    currentPage: number;
    selectedSort: string;
  }>;
  search(query: string): Promise<IProduct[]>;
  updateById(
    productId: mongoose.Types.ObjectId,
    updateData: Partial<IProduct>
  ): Promise<IProduct>;
  deleteById(productId: mongoose.Types.ObjectId): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  public async add(productData: IProduct): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  public async findAll(): Promise<IProduct[]> {
    return await Product.find().exec();
  }

  public async findNew(): Promise<IProduct[]> {
    return await Product.find().sort({ createdAt: -1 }).limit(50);
  }

  public async findById(
    productId: mongoose.Types.ObjectId
  ): Promise<IProduct | null> {
    return await Product.findById(productId).exec();
  }

  public async findByName(productName: string): Promise<IProduct | null> {
    return await Product.findOne({ productName }).exec();
  }

  public async findByCategory(filters: any): Promise<{
    totalProducts: number;
    products: IProduct[];
    availableFilters: IAvailableFilters;
    availableSorts: IAvailableSorts[];
    currentPage: number;
    selectedSort: string;
  }> {
    const {
      cgid,
      size,
      brand,
      colors,
      price,
      scgid,
      offset = 0,
      limit = 60,
      sort = undefined,
    } = filters;

    if (!cgid) {
      throw new Error("Category (cgid) is required.");
    }

    // Construct the query based on provided filters
    const query: any = { category: cgid };

    // Add subcategory filter
    if (scgid && scgid.length > 0) {
      query.subcategory = { $in: scgid };
    }

    if (size) {
      query.size = size;
    }
    if (brand && brand.length > 0) {
      query.brand = { $in: brand };
    }
    if (colors && colors.length > 0) {
      query.colors = { $in: colors };
    }

    // Ensure price is handled as a range filter
    if (price) {
      // Assuming the price format is '$20 - $50'
      const [minPrice, maxPrice] = price
        .replace(/\$|\,/g, "") // Remove dollar signs and commas
        .split(" - ") // Split by ' - '
        .map(Number); // Convert the remaining strings to numbers

      console.log(minPrice, maxPrice); // This should log the numeric values

      // Add price filter
      if (!isNaN(maxPrice)) {
        // Check if maxPrice is valid
        query.productPrice = { $gte: minPrice, $lte: maxPrice };
      } else if (!isNaN(minPrice)) {
        // Check if minPrice is valid
        query.productPrice = { $gte: minPrice };
      }
    }

    const sortQuery: any = {};
    if (sort === "highest-price") {
      sortQuery.productPrice = -1;
    } else if (sort === "lowest-price") {
      sortQuery.productPrice = 1;
    } else if (sort === "newest") {
      sortQuery.createdAt = -1;
    } else if (sort === "oldest") {
      sortQuery.createdAt = 1;
    }

    const matchedProducts = await Product.find(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(offset)
      .limit(limit)
      .exec();

    const availableFilters = this.extractFiltersFromProducts(
      matchedProducts,
      filters
    );
    const availableSorts = this.getSortingOptions(sort);
    const totalProducts = matchedProducts.length;
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      totalProducts,
      products,
      availableFilters,
      availableSorts,
      currentPage,
      selectedSort: sort,
    };
  }

  // Helper function to extract available filters from products
  private extractFiltersFromProducts(products: any[], queryParams: any): any {
    const { size, brand, colors, price, scgid } = queryParams;

    // Use sets to collect unique filter values from the products
    const availableSizes = new Set<string>();
    const availableBrands = new Set<string>();
    const availableColors = new Set<string>();
    const availablePrices = new Set<string>();
    const availableSubcategories = new Set<string>(); // For unique subcategories

    products.forEach((product) => {
      // Add available sizes
      if (product.size && Array.isArray(product.size)) {
        product.size.forEach((s: string) => availableSizes.add(s));
      }

      // Add available brands
      if (product.brand) {
        availableBrands.add(product.brand);
      }

      // Add available colors
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach((color: string) => availableColors.add(color));
      }

      // Add available price ranges

      if (product.productPrice) {
        if (product.productPrice < 10) {
          availablePrices.add(`${CURRENCY_SYMBOL}0 - ${CURRENCY_SYMBOL}10`);
        } else if (product.productPrice < 20) {
          availablePrices.add(`${CURRENCY_SYMBOL}10 - ${CURRENCY_SYMBOL}20`);
        } else if (product.productPrice < 50) {
          availablePrices.add(`${CURRENCY_SYMBOL}20 - ${CURRENCY_SYMBOL}50`);
        } else if (product.productPrice < 100) {
          availablePrices.add(`${CURRENCY_SYMBOL}50 - ${CURRENCY_SYMBOL}100`);
        } else if (product.productPrice < 200) {
          availablePrices.add(`${CURRENCY_SYMBOL}100 - ${CURRENCY_SYMBOL}200`);
        } else if (product.productPrice < 500) {
          availablePrices.add(`${CURRENCY_SYMBOL}200 - ${CURRENCY_SYMBOL}500`);
        } else if (product.productPrice < 1000) {
          availablePrices.add(`${CURRENCY_SYMBOL}500 - ${CURRENCY_SYMBOL}1000`);
        } else if (product.productPrice < 5000) {
          availablePrices.add(
            `${CURRENCY_SYMBOL}1000 - ${CURRENCY_SYMBOL}5000`
          );
        } else if (product.productPrice < 10000) {
          availablePrices.add(
            `${CURRENCY_SYMBOL}5000 - ${CURRENCY_SYMBOL}10000`
          );
        } else {
          availablePrices.add(`${CURRENCY_SYMBOL}10000 and up`);
        }
      }

      // Add available subcategories
      if (product.subcategory && Array.isArray(product.subcategory)) {
        product.subcategory.forEach((sc: string) =>
          availableSubcategories.add(sc)
        );
      }
    });

    // Build filters with `selected` property
    return [
      {
        label: "Size",
        value: "size",
        options: Array.from(availableSizes).map((s) => ({
          value: s,
          label: s,
          selected: size === s,
        })),
      },
      {
        label: "Brand",
        value: "brand",
        options: Array.from(availableBrands).map((b) => ({
          value: b,
          label: b,
          selected: brand === b,
        })),
      },
      {
        label: "Color",
        value: "colors",
        options: Array.from(availableColors).map((c) => ({
          value: c,
          label: c,
          selected: colors?.includes(c),
        })),
      },
      {
        label: "Price",
        value: "price",
        options: Array.from(availablePrices).map((p) => ({
          value: p,
          label: this.getPriceLabel(p),
          selected: price === p,
        })),
      },
      {
        label: "Subcategory",
        value: "scgid",
        options: Array.from(availableSubcategories).map((sc) => ({
          value: sc,
          label: sc,
          selected: scgid?.includes(sc) || false, // Correctly check if the subcategory is selected
        })),
      },
    ];
  }

  // Utility function to return a user-friendly price range label
  private getPriceLabel(priceRange: string): string {
    switch (priceRange) {
      case "(20.00)...(50.00)":
        return "$20 - $50";
      case "(50.00)...(100.00)":
        return "$50 - $100";
      case "(100.00)...(200.00)":
        return "$100 - $200";
      case "(200.00)...(500.00)":
        return "$200 - $500";
      default:
        return priceRange;
    }
  }

  // Sorting options for the products
  private getSortingOptions(currentSort: string): IAvailableSorts[] {
    const sortOptions = [
      { sortLabel: "Price: High to Low", sortKey: "highest-price" },
      { sortLabel: "Price: Low to High", sortKey: "lowest-price" },
      { sortLabel: "Newest First", sortKey: "newest" },
      { sortLabel: "Oldest First", sortKey: "oldest" },
    ];

    return sortOptions.map((option) => ({
      ...option,
      selected: option.sortKey === currentSort,
    }));
  }

  public async search(query: string): Promise<IProduct[]> {
    // Initialize an array to hold search conditions
    const searchConditions: any[] = [];

    // Regex to find numeric values in the query
    const numericRegex = /\b\d+\b/g;
    const numericMatches = query.match(numericRegex);
    const numericQuery = numericMatches ? parseFloat(numericMatches[0]) : null;

    // Remove numeric part from query to isolate text part
    const textQuery = query.replace(numericRegex, "").trim();

    // Text-based search conditions
    if (textQuery) {
      searchConditions.push(
        ...[
          { productName: { $regex: textQuery, $options: "i" } },
          { category: { $regex: textQuery, $options: "i" } },
          { brand: { $regex: textQuery, $options: "i" } },
          { subcategory: { $regex: textQuery, $options: "i" } },
        ]
      );
    }

    // Numeric-based search condition for price
    if (numericQuery !== null) {
      searchConditions.push({
        productPrice: {
          $gte: numericQuery - 1000, // Adjust range as necessary
          $lte: numericQuery + 1000,
        },
      });
    }

    // Ensure there are search conditions to apply
    if (searchConditions.length === 0) return [];

    return await Product.find({ $or: searchConditions }).exec();
  }

  public async updateById(
    productId: mongoose.Types.ObjectId,
    updateData: Partial<IProduct> // Use Partial to indicate all properties are optional
  ): Promise<IProduct> {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
      }
    ).exec();
    if (!updatedProduct) {
      throw new Error("Product not found");
    }
    return updatedProduct;
  }

  public async deleteById(
    productId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const result = await Product.findByIdAndDelete(productId).exec();
    return !!result;
  }
}
