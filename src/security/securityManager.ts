import * as jwt from "jose"
import { Env } from "../envSetup.js";
import { alertList,  AppError } from "../tools/alertsMessageList.js";
import { UserStruct } from "../users/userStruct.js";
import { RoleList } from "./roleList.js";

export class SecurityManager {

    public static SecurityMiddleware(roles: RoleList[], obligatory: boolean = false) {
        // TODO: Implement security middleware
        return async (req: any, res: any, next: any) => {

            const token = req.headers["authorization"];
            const cryptoPass = req.headers["seed"]

            if (cryptoPass && cryptoPass !== "") {
                const Pass = Env.CRYPTOPASS
                if (cryptoPass == Pass) {
                     req["payload"] = {
                        roles: [RoleList.SuperAdmin]
                    }
                    next();
                    return;
                }
            }

            if (!token) {
                throw  new AppError(alertList.tokenIsMissing);
            }

            const result = await this.verifyToken(token)
            req["payload"] = result.payload;
            const userdata = new UserStruct(result.payload as unknown as UserStruct);

            if (userdata.roles!.includes(RoleList.SuperAdmin)) {
                next();
                return;
            }

            if (roles.includes(RoleList.any)) {
                next();
                return;
            }

            let roleMatch = 0;

            // this.verifyUserRole(userdata, roles);
            userdata.roles!.forEach((role: number) => {
                if (roles.includes(role)) {
                    roleMatch++;
                }
            })

            const isreq = obligatory ? roleMatch == roles.length : roleMatch > 0;

            if (!isreq) {
                throw new AppError(alertList.userIsNotAuthorized);
            } else {
                next();
            }
        }
    }

    public static async createToken(data: any) {

        // const sign = new jwt.SignJWT(data).setExpirationTime(Env.JWT_EXPIRY).sign(new TextEncoder().encode(Env.JWT_SECRET));
        const sign = await new jwt.SignJWT(data).setProtectedHeader({ alg: "HS256" }).setExpirationTime(Env.JWT_EXPIRY).sign(new TextEncoder().encode(Env.JWT_SECRET));
        return sign;

    }
    public static async verifyToken(token: string) {

        token = token.replace("Bearer ", ""); // Remove Bearer prefix if present
        try {
            const result = await jwt.jwtVerify(token, new TextEncoder().encode(Env.JWT_SECRET));
            return result;

        } catch (error: any) {
            switch (error.code) {
                case "ERR_JWS_INVALID":
                case "ERR_JWT_SIGNATURE":
                case "ERR_JWT_NOT_ALLOWED":
                case "ERR_JWT_INVALID_HEADER":
                case "ERR_JWT_INVALID_PAYLOAD":
                    throw new AppError(alertList.tokenIsInvalid.message);

                case "ERR_JWT_EXPIRED":
                    // throw new Err(alertList.tokenIsExpired.message, alertList.tokenIsExpired.statusCode);
                    throw new AppError(alertList.tokenIsExpired);
                case "ERR_JWS_SIGNATURE_VERIFICATION_FAILED":
                    throw new AppError(alertList.tokenSignatureIsInvalid);

                default:
                    throw error;
            }
        }
    }

    public static decriptToken(token: string) {

        const decript = jwt.decodeJwt(token);
        return decript;
    }

    public static verifyUser(user: string) { }
    public static verifyUserRole(userData: UserStruct, roles: number[]) {
        return true;
    }

}