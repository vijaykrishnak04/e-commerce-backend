import mongoose from "mongoose";
import { IProduct } from "../../entities/Product";
import { IProductRepository } from "../../repositories/ProductRepository";
import { deleteFiles } from "../../services/cloudinary";

export class EditProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    productId: mongoose.Types.ObjectId,
    productData: any
  ): Promise<IProduct> {
    const productExist = await this.productRepository.findByName(
      productData.productName
    );

    console.log("productId:", productId);
    console.log("productExist._id:", productExist?._id);
    console.log(
      "Is productId equal to productExist._id?",
      productId.equals(productExist?._id)
    );

    if (
      productExist?.productName === productData?.productName &&
      !productId.equals(productExist?._id)
    ) {
      if (productData?.files) {
        let deletingFiles = [];
        for (const { filename } of productData.files) {
          deletingFiles.push(filename);
        }
        deleteFiles(deletingFiles);
      }
      throw new Error("Product with this name already exist");
    }
    // Check if specifications is already a JavaScript object/array
    // Only parse if it's a string
    const safelyParseJSON = (jsonString: string) => {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        // Log the error or handle it as needed
        console.error("Error parsing JSON string:", error);
        throw new Error(`Invalid JSON format: ${error.message}`);
      }
    };

    // Use the safelyParseJSON function for parsing
    const parsedSpecifications =
      typeof productData?.specifications === "string"
        ? safelyParseJSON(productData?.specifications)
        : productData?.specifications;

    const parsedColors =
      typeof productData?.color === "string"
        ? safelyParseJSON(productData?.color)
        : productData?.color;

    const parsedSubcategory = productData?.subcategory.split(",");
    const parsedSize = productData?.size && productData?.size.split(",");

    const numericProductPrice = parseFloat(productData?.productPrice);
    const numericStock = parseInt(productData?.stock, 10);

    const MAX_IMAGES = 4;  // Define the maximum number of product images
    let deletingFiles = []; // Store files to be deleted from Cloudinary
    const newImages = new Array(MAX_IMAGES).fill(null);

    // Fill newImages with existing data or replace with new data where available
    for (let i = 0; i < MAX_IMAGES; i++) {
      const existingImage = productExist.images[i];
      const newFile = productData.files.find((file:any) => file.originalname === `productImage${i + 1}`);
      
      if (newFile) {
        if (existingImage) {
          deletingFiles.push(existingImage.publicId);  // Schedule old image for deletion
        }
        newImages[i] = { url: newFile.path, publicId: newFile.filename };  // Use new image data
      } else if (existingImage) {
        newImages[i] = existingImage;  // Retain existing image
      }
    }

    deleteFiles(deletingFiles);

    const newProductData = {
      ...productData,
      productPrice: numericProductPrice,
      stock: numericStock,
      specifications: parsedSpecifications,
      subcategory: parsedSubcategory,
      colors: parsedColors,
      size: parsedSize,
      images: newImages.filter(image => image !== null),
    };
    console.log(newImages);
    console.log(newProductData?.images);
    return await this.productRepository.updateById(productId, newProductData);
  }
}
