import { Request, Response } from "express";
import { CreateOrderUseCase } from "../use_cases/order/CreateOrder";
import { UpdateOrderStatusUseCase } from "../use_cases/order/UpdateOrderStatus";
import { CancelOrderUseCase } from "../use_cases/order/CancelOrder";
import { ReturnOrderUseCase } from "../use_cases/order/ReturnOrder";
import { GetOrderDetailsUseCase } from "../use_cases/order/GetOrderDetails";
import { ListOrdersByUserUseCase } from "../use_cases/order/ListOrdersByUser";
import mongoose from "mongoose";
import { VerifyPaymentUseCase } from "../use_cases/order/VerifyPayment";

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private verifyPaymentUseCase: VerifyPaymentUseCase,
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private cancelOrderUseCase: CancelOrderUseCase,
    private returnOrderUseCase: ReturnOrderUseCase,
    private getOrderDetailsUseCase: GetOrderDetailsUseCase,
    private listOrdersByUserUseCase: ListOrdersByUserUseCase
  ) {}

  async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderData = req.body;
      const newOrder = await this.createOrderUseCase.execute(orderData);
      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const { id, paymentId, orderId, signature } = req.body;
      const newOrder = await this.verifyPaymentUseCase.execute(
        paymentId,
        orderId,
        signature,
        id
      );
      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<Response> {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.orderId);
      const { status } = req.body;
      const updatedOrder = await this.updateOrderStatusUseCase.execute(
        orderId,
        status
      );
      return res.status(200).json({ success: true, updatedOrder });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.orderId);
      const result = await this.cancelOrderUseCase.execute(orderId);
      return res.status(200).json({ success: true, result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async returnOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.orderId);
      const result = await this.returnOrderUseCase.execute(orderId);
      return res.status(200).json({ success: true, result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getOrderDetails(req: Request, res: Response): Promise<Response> {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.orderId);
      const orderDetails = await this.getOrderDetailsUseCase.execute(orderId);
      return res.status(200).json({ success: true, orderDetails });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listOrdersByUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      const orders = await this.listOrdersByUserUseCase.execute(userId);
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<Response> {
    try {
      console.log('bruhh"s here');
      
      const orders = await this.getOrderDetailsUseCase.getAll();
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
