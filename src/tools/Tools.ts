import { getDevLogType } from "../envSetup.js";
import { AppError,  } from "./alertsMessageList.js";


export function emailValidation(email: string): boolean {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = emailRegex.test(email);
    return result;
}

export function mobilePhoneValidation(cellphone: string): boolean {
    // Regular expression to validate Colombian cellphone format
    const cellphoneRegex = /^(3[0-9]{9})$/;
    return cellphoneRegex.test(cellphone);
}

export function validateEnum(value: string, enumType: any, errorMessage: AppError) {

    const enumValidate = Object.values(enumType).includes(value);
    if (!enumValidate) {
        const err = errorAppendMessages(errorMessage, Object.values(enumType));
        throw new AppError(err);
    }
}

export function errorAppendMessages(erroItem: AppError, message: string[]) {

    const er: AppError = { ...erroItem };
    er.message += ` | ${(message.length > 1) ? "Options:" : "Err: "}${message.map((e) => e)}`;

    return er;
}

export function excelDateConvert(date: string) {
    var excelEpoch = new Date(1899, 11, 30);
    var jsDate = new Date(excelEpoch.getTime() + parseInt(date) * (24 * 60 * 60 * 1000));
    return jsDate;
}

export function devLog(...args: any[]) {
    if (getDevLogType()) {
        const timestamp = new Date().toISOString();
        console.log(`⌛️ [${timestamp}]`);
        console.log(...args);
    }
    // if (logType.includes("dev")) {
    //     console.log(...args);
    // }
}


