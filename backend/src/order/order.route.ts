
import { Router } from "express";
import { fetchOrders } from "./order.controller";

const OrderRouter = Router();
OrderRouter.get("/", fetchOrders)


export default OrderRouter;