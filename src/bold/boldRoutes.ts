import { Router } from "express";
import { boldManager } from "./boldManager.js";

const boldRoutes = Router();
const prefix = "/bold";

boldRoutes.post(`${prefix}/webhook`, async (req, res) => {
    const resp = await boldManager.handleWebhook(req.body);
    res.send(resp);
})

export default boldRoutes