import { Request, Response } from "express";
import OrderModel from "./order.model";

export const createOrder = async (payload: any) => {
    try {
        const order = await OrderModel.create(payload);
        return order;
    } catch (error) {
        console.log("Create Order Error:", error);
        throw error;
    }
};

export const fetchOrders = async (req: Request, res: Response) => {
    try {
        const orders = await OrderModel.find();

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};