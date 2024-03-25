// src/routes/wishlistRoutes.ts

import { Router } from "express";
import { WishlistRepository } from "../repositories/WishlistRepository";
import { WishlistController } from "../controllers/WishlistController";
import { AddItemToWishlistUseCase } from "../use_cases/wishlist/AddItemToWishlist";
import { RemoveItemFromWishlistUseCase } from "../use_cases/wishlist/RemoveItemFromWishlist";
import { GetUserWishlistUseCase } from "../use_cases/wishlist/GetUserWishlist";
import { authenticateUser } from "../middlewares/authenticate";

const wishlistRepository = new WishlistRepository();
const wishlistController = new WishlistController(
  new AddItemToWishlistUseCase(wishlistRepository),
  new RemoveItemFromWishlistUseCase(wishlistRepository),
  new GetUserWishlistUseCase(wishlistRepository)
);

const router = Router();

router.post("/add-item", authenticateUser, (req, res) => {
  wishlistController.addItem(req, res);
});
router.delete("/remove-item", authenticateUser, (req, res) =>
  wishlistController.removeItem(req, res)
);
router.get("/:userId", authenticateUser, (req, res) =>
  wishlistController.getUserWishlist(req, res)
);

router.get("/populated/:userId", authenticateUser, (req, res) =>
  wishlistController.getWishlist(req, res)
);

export default router;
