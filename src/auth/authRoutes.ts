import { Router } from "express";
import { RoleList } from "../security/roleList.js";
import { SecurityManager } from "../security/securityManager.js";
import { UserManager } from "../users/usersManager.js";
import { UserStruct } from "../users/userStruct.js";
import { AuthManager } from "./authManager.js";

const authRoutes = Router();
const prfix = "/auth";

authRoutes.post(`${prfix}/login`, async (req, res) => {

    const body: UserStruct = req.body;

    const userData = await AuthManager.login(body);

    res.send(userData);
});


//can register with cryptopass, using header seed with cryptopass value
authRoutes.post(`${prfix}/user/register`, SecurityManager.SecurityMiddleware([RoleList.Admin]), async (req, res) => {
    const body = req.body;
    const authRegister: UserStruct = await AuthManager.register(body)

    //save to db
    const result = await UserManager.registerUser(authRegister);

    authRegister._id = result.insertedId;
    authRegister.password = "";

    res.send(authRegister);
});

authRoutes.delete(`${prfix}/users`, SecurityManager.SecurityMiddleware([RoleList.Admin]), async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        throw new Error("User ID is required");
    }

    const result = await UserManager.deleteUser(userId as string).catch((err) => {
        throw err;
    });
    res.send(true)
})

authRoutes.post(`${prfix}/logout`, (req, res) => {
    res.send("Logout Page");
});

authRoutes.post(`${prfix}/forgot-password`, (req, res) => {
    res.send("Forgot Password Page");
});

authRoutes.get(`${prfix}/reset-password`, (req, res) => {
    res.send("Reset Password Page");
});

authRoutes.get(`${prfix}/verify-email`, (req, res) => {
    res.send("Verify Email Page");
})

authRoutes.post(`${prfix}/verifyToken`, async (req, res) => {
    const token = req.body.token;

    const result = await SecurityManager.verifyToken(token)

    res.send(result);
});

authRoutes.get(`${prfix}/users`, async (req, res) => {
    const users = await UserManager.findUser({}, true);

    res.send(users);
})

function isSuperAdmin(roles: number[]): boolean {
    return roles.includes(1);
}

authRoutes.put(`${prfix}/users`, SecurityManager.SecurityMiddleware([RoleList.Admin]), async (req: any, res) => {

    const body: UserStruct = req.body;
    const { roles }: UserStruct = req["payload"];
    if (!body._id) {
        res.status(400).send("User ID is required");
        return;
    }

    // Remove super admin role (1) from body.roles if current user is not a super admin
    if (!isSuperAdmin(roles!)) {
        body.roles = body.roles!.filter((role) => role != 1);
    }

    const result = await UserManager.updateUser(body).catch((err) => {
        throw err
    })

    res.send(result);

})

authRoutes.put(`${prfix}/users/password`, SecurityManager.SecurityMiddleware([RoleList.any]), async (req: any, res) => {

    const result = await AuthManager.changePassword(req["payload"], req.body.userId, req.body.password);
    res.send(result);
})

export default authRoutes;