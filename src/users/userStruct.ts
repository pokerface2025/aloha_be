import { ObjectId } from "mongodb";
import { DateInterface } from "../tools/dateInterface.js";

export class UserStruct extends DateInterface {

    _id: ObjectId;
    username: string;
    password?: string;
    email?: string;
    phone?: number;
    prefix?: string;
    expireTokenAt?: Date;
    roles?: number[];
    token?: string;

    constructor(userData: UserStruct) {
        super(userData);
        this._id = userData._id;
        this.username = userData.username;
        this.password = userData.password;
        this.email = userData.email??"";
        this.roles = userData.roles??[];
        this.token = userData.token??"";
        this.phone = userData.phone??0;
        this.prefix = userData.prefix??"";
    }
}