import { Router } from "express";
import { OrdersManager } from "./ordersManager.js";
import { SecurityManager } from "../security/securityManager.js";
import { RoleList } from "../security/roleList.js";


const orderRoutes = Router()
const prefix = "/orders"

orderRoutes.post(`${prefix}/list`,SecurityManager.SecurityMiddleware([RoleList.Admin]), async (req, res) => {
    const result = await OrdersManager.getOrdersList(req.body);
    res.send(result);
})

orderRoutes.post(`${prefix}/reg`, async (req, res) => {
    const result = await OrdersManager.registerAOrder(req.body);
    res.send(result);
})

orderRoutes.post(`${prefix}/update`, async (req, res) => {
    const result = await OrdersManager.updateOrder(req.body);
    res.send(result);   

})

export default orderRoutes