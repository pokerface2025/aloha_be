import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { RoleList } from "../security/roleList.js";
import { SecurityManager } from "../security/securityManager.js";
import { alertList, AppError } from "../tools/alertsMessageList.js";
import { emailValidation } from "../tools/Tools.js";
import { UserManager } from "../users/usersManager.js";
import { UserStruct } from "../users/userStruct.js";

export class AuthManager {

    static async login(data: UserStruct) {

        if (data.username === undefined || data.password === undefined) {
            throw new AppError(alertList.usernameOrPasswordIsEmpty);
        }

        const username = data.username.toLowerCase().trim();
        const password = data.password?.trim();

        const userFind: any[] = await UserManager.getUserByUsername(username);
        const userData: UserStruct = userFind[0];
        if (!userData) {
            throw new AppError(alertList.userNotFound);
        }
        // Check if the password is empty
        if (!data.password) {
            throw new AppError(alertList.passwordIsEmpty);
        }
        // Check if the password is correct
        const passwordIsCorrect = bcrypt.compareSync(password!, userData.password!);

        if (!passwordIsCorrect) {
            throw new AppError(alertList.passwordIsIncorrect);
        }

        //Generate Token
        const token = await SecurityManager.createToken(userData);
        userData.token = token!;
        const tokenData = await SecurityManager.decriptToken(token!);
        userData.expireTokenAt = new Date(tokenData.exp! * 1000);

        if (userData.password) {
            delete userData.password;
        }

        return userData;
    }

    static async register(userData: UserStruct, payload?: any) {

        const username = userData.username?.toLowerCase();
        const password = userData.password?.trim();
        const email = userData.email?.toLowerCase().trim() ?? "";

        const currentDate = new Date();

        // Check if the password is empty
        if (!userData.password) {
            throw new AppError(alertList.passwordIsEmpty);
        }
        // Check if the email is empty
        if (!userData.email) {
            throw new AppError(alertList.emailIsEmpty);
        }
        // Check if the username is empty
        if (!userData.username) {
            throw new AppError(alertList.usernameIsEmpty);
        }
        // Check if the email is valid
        const eVal = emailValidation(email);
        if (!emailValidation(email)) {
            // throw new new AppError(alertList.emailIsInvalid + "\n" + userData.email, alertList.emailIsInvalid.statusCode);
            throw new AppError(alertList.emailIsInvalid);
        }

        const users = await UserManager.findUser({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (users.length > 0) {
            throw new AppError(alertList.userOrEmailExist);
        }
        const passwordCrypt = bcrypt.hashSync(password!, 10);

        const user: UserStruct = {
            _id: new ObjectId(),
            username: username,
            email: email,
            password: passwordCrypt,
            roles: userData.roles,
            phone: userData.phone,
            prefix: userData.prefix,
            createdAt: currentDate,
            updatedAt: currentDate
        }

        if (payload && payload["roles"]) {
            user.roles = payload["roles"];
        }

        return user;
    }

    static async changePassword({ roles }: UserStruct, userId: string, password: string) {

        const lowestRole = Math.min(...roles!);

        const id = new ObjectId(userId);
        const user = await UserManager.getUserById(userId);
        if (!user) {
            throw new AppError(alertList.userNotFound);
        }

        const usrLowestRole = Math.min(...user.roles!);

        switch (lowestRole) {
            case RoleList.SuperAdmin:
                // Super Admin can change any user password
                break;
            case RoleList.Admin:
                // Admin can change any user password except Super Admin
                if (usrLowestRole === RoleList.SuperAdmin) {
                    throw new AppError(alertList.userIsNotAuthorized);
                }
                break;
            case RoleList.User:
                // User can only change their own password
                if (id.toString() !== user._id.toString()) {
                    throw new AppError(alertList.userIsNotAuthorized);
                }
                break;
            default:
                throw new AppError(alertList.userIsNotAuthorized);
        }

        user.updatedAt = new Date();

        const Hash = bcrypt.hashSync(password, 10);
        user.password = Hash;

        const result = await UserManager.updateUser(user).catch((err) => {
            // throw new new AppError("Error updating user password: " + err);
            throw err
        })

        return true

    }

}