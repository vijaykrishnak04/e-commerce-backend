// src/routes/orderRoutes.ts

import { Router, Request, Response } from "express";
import { OrderController } from "../controllers/OrderController";
import { CreateOrderUseCase } from "../use_cases/order/CreateOrder";
import { UpdateOrderStatusUseCase } from "../use_cases/order/UpdateOrderStatus";
import { CancelOrderUseCase } from "../use_cases/order/CancelOrder";
import { ReturnOrderUseCase } from "../use_cases/order/ReturnOrder";
import { GetOrderDetailsUseCase } from "../use_cases/order/GetOrderDetails";
import { ListOrdersByUserUseCase } from "../use_cases/order/ListOrdersByUser";
import { OrderRepository } from "../repositories/OrderRepository";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middlewares/authenticate"; // Assuming you have authentication middleware
import { VerifyPaymentUseCase } from "../use_cases/order/VerifyPayment";
import { CouponRepository } from "../repositories/CouponRepository";
import { CartRepository } from "../repositories/CartRepository";

const orderRepository = new OrderRepository();
const orderController = new OrderController(
  new CreateOrderUseCase(
    orderRepository,
    new CouponRepository(),
    new CartRepository()
  ),
  new VerifyPaymentUseCase(orderRepository),
  new UpdateOrderStatusUseCase(orderRepository),
  new CancelOrderUseCase(orderRepository),
  new ReturnOrderUseCase(orderRepository),
  new GetOrderDetailsUseCase(orderRepository),
  new ListOrdersByUserUseCase(orderRepository)
);

const router = Router();

// Route for creating a new order
router.post(
  "/create-order",
  authenticateUser,
  (req: Request, res: Response) => {
    orderController.createOrder(req, res);
  }
);

router.post(
  "/verify-payment",
  authenticateUser,
  (req: Request, res: Response) => {
    orderController.verifyPayment(req, res);
  }
);

// Route for updating an order's status
router.patch(
  "/status/:orderId",
  authenticateUser,
  (req: Request, res: Response) => {
    orderController.updateOrderStatus(req, res);
  }
);

// Route for cancelling an order
router.patch(
  "/cancel/:orderId",
  authenticateUser,
  (req: Request, res: Response) => {
    orderController.cancelOrder(req, res);
  }
);

// Route for returning an order
router.patch(
  "/return/:orderId",
  authenticateUser,
  (req: Request, res: Response) => {
    orderController.returnOrder(req, res);
  }
);

// Route for getting the details of a specific order
router.get("/:orderId", authenticateUser, (req: Request, res: Response) => {
  orderController.getOrderDetails(req, res);
});

// Route for listing all orders of a specific user
router.get("/user/:userId", authenticateUser, (req: Request, res: Response) => {
  orderController.listOrdersByUser(req, res);
});

//admin
router.get("/", authenticateAdmin, (req: Request, res: Response) => {
  orderController.getAllOrders(req, res);
});

// At the very end of your orderRoutes.ts, after all other route definitions
router.all("/*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
