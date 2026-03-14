import * as dotenv from "dotenv";
import * as fs from "fs";
import { env } from "process";

dotenv.config();

export let RunningServerAt: runAs;

// Create an object with environment variables
export const Env = {
    GENERAL: "",
    PORT: "",
    DEVPORT: "",
    RUNAS: "prod",
    MONGOURI: "",
    MONGODB: "",
    JWT_SECRET: "",
    JWT_EXPIRY: "",
    CRYPTOPASS: "",
    CRYPTOSALT: "",
};

export enum runAs {
    prod = "prod",
    dev = "dev",
    devServer = "devServer",
}

export var logType: any = { dev: false };

export function setLogType(type: any) {
    logType = type;
}
export function getDevLogType() {
    return logType["dev"];
}

export function environmentSetup() {
    const missingKeys: string[] = [];

    const serverLess = process.env["SERVERLESS"];
    if (serverLess) {
        console.log("Running in serverless mode.");
    } else {

        console.log("Running in traditional server mode.");
    }

    // Check for missing environment variables
    for (const key in Env) {
        const keyname = key.toUpperCase();
        if (!process.env.hasOwnProperty(keyname)) {
            missingKeys.push(key.toUpperCase());
        } else if (process.env.hasOwnProperty(keyname)) {
            //@ts-ignore
            Env[key.toUpperCase()] = process.env[keyname];
        }
    }

    // Append missing keys to .env file
    if (missingKeys.length > 0) {
        const envPath = ".env";
        const envContent = missingKeys.map((key) => `${key}=`).join("\n");

        if (!serverLess){
            fs.appendFileSync(envPath, `\n${envContent}`);
        }
        console.log(`\n\n 🔴 Missing keys [ ${missingKeys.join(", ")} ] have been appended to ${envPath}. Please update these values to ensure the application works properly.\n\n`);
        throw new Error(`Missing environment variables: ${missingKeys.join(", ")}`);
    }

    if (Env.RUNAS === runAs.dev || Env.RUNAS === runAs.devServer) {
        logType = { dev: true, telnet: false };
        console.log("Running in development mode.");
        RunningServerAt = runAs.dev;
        Env.PORT = Env.DEVPORT;
        Env.MONGODB = "TEST"

    } else {
        console.log("Running in production mode.");
        RunningServerAt = runAs.prod;
    }

}

// export class SentryManager {

//     public static sentryClient: sentry.NodeClient | undefined;

//     public static init() {
//         // Initialize Sentry here
//         this.sentryClient = sentry.init({
//             dsn: Env.SENTRYDSN,
//             sendDefaultPii: true,
//         });
//     }

//     public static captureException(error: Error) {
//         // Capture exceptions here
//         sentry.captureException(error);
//         console.error("🔴 Sentry error:", error);
//     }
//     public static captureMessage(message: string) {
//         // Capture messages here
//         sentry.captureMessage(message);
//         console.error("🟡 Sentry message:", message);

//     }

// }