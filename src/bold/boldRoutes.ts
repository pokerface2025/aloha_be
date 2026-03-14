import { Router } from "express";
import { boldManager } from "./boldManager.js";

const boldRoutes = Router();
const prefix = "/bold";

boldRoutes.post(`${prefix}/createpayment`, async (req, res) => {
    const data = await boldManager.createPaymentData(req.body);
    const paymentLinlk = await boldManager.CreatePaymentLink(data);
    res.send(paymentLinlk);

})

boldRoutes.post(`${prefix}/webhook`, async (req, res) => {
    const resp = await boldManager.handleWebhook(req.body);
    res.send(resp);
})

export default boldRoutes