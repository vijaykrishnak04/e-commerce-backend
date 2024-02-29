// src/routes/productRoutes.ts

import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { AddProductUseCase } from 'src/use_cases/product/AddProduct';
import { ProductRepository } from 'src/repositories/ProductRepository';

const router = Router();
const productController = new ProductController(
    new AddProductUseCase(new ProductRepository)
);

router.post('/add-product', productController.addProduct)
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

export default router;
