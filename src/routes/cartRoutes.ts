// src/routes/cartRoutes.ts

import { Request, Response, Router } from "express";
import { CartController } from "../controllers/CartController";
import { CartRepository } from "../repositories/CartRepository";

import { AddToCart } from "../use_cases/cart/AddToCart";
import { RemoveFromCart } from "../use_cases/cart/RemoveFromCart";
import { GetCart } from "../use_cases/cart/GetCart";

import { authenticateUser } from "../middlewares/authenticate";
import { UpdateCartItemQuantity } from "../use_cases/cart/UpdateCartItemQuantity";

const cartRepository = new CartRepository();
const cartController = new CartController(
  new AddToCart(cartRepository),
  new RemoveFromCart(cartRepository),
  new GetCart(cartRepository),
  new UpdateCartItemQuantity(cartRepository)
);

const router = Router();

// Add item to cart
router.post("/add-to-cart", authenticateUser, (req: Request, res: Response) => {
  cartController.addItemToCart(req, res);
});

// Remove item from cart
router.delete(
  "/remove-from-cart",
  authenticateUser,
  (req: Request, res: Response) => {
    cartController.removeItemFromCart(req, res);
  }
);

router.post(
  "/update-item-quantity",
  authenticateUser,
  (req: Request, res: Response) =>
    cartController.updateCartItemQuantity(req, res)
);

// Get cart for a user
router.get(
  "/get-cart/:userId",
  authenticateUser,
  (req: Request, res: Response) => {
    cartController.getCart(req, res);
  }
);

export default router;
