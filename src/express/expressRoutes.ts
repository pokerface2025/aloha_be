import { Router } from "express";
import { version } from "os";
import * as path from 'path';
import authRoutes from "../auth/authRoutes.js";
import { setLogType } from "../envSetup.js";
import boldRoutes from "../bold/boldRoutes.js";
import orderRoutes from "../orders/ordersRoutes.js";

const expressRoutes = Router();

expressRoutes.use(authRoutes,
    authRoutes,
    orderRoutes,
    boldRoutes
);

// expressRoutes.get("/", (req, res) => {
//     res.send("Api Running, version: " + version);
// });

expressRoutes.post("/log", (req, res) => {
    const logTp: any = req.body.logType;

    setLogType(logTp);
    res.send(`Log With Params ${JSON.stringify(logTp)}`);

})

export default expressRoutes;