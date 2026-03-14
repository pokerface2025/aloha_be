import { Router } from "express";
import { OrdersManager } from "./ordersManager.js";


const orderRoutes = Router()
const prefix = "/orders"

orderRoutes.post(`${prefix}/list`, (req, res) => {
    res.send("Get all orders")
})

orderRoutes.post(`${prefix}/reg`, async (req, res) => {
    const result = await OrdersManager.registerAOrder(req.body);
    res.send(result);
})

orderRoutes.post(`${prefix}/update`, (req, res) => {

})

export default orderRoutes