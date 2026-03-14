import { ObjectId, type Filter } from "mongodb";
import { CollectionList } from "../database/collections.js";
import { getCollection, getMongoClient } from "../database/databaseManager.js";
import { alertList, AppError } from "../tools/alertsMessageList.js";
import { UserStruct } from "./userStruct.js";

export class UserManager {

    public static async getUserById(id: string) {
        const users = await this.findUser({ _id: new ObjectId(id) });
        if (users.length == 0) {
            return null;
        }
        return new UserStruct(users[0] as UserStruct);
    }
    public static async getUserByUsername(username: string) {
        return await this.findUser({ username: username });
    }
    public static async getUserByEmail(email: string) {
        return await this.findUser({ email: email });
    }

    public static async findUser(Query: Filter<any>, filter?: boolean) {

        const passfilter = filter ? { projection: { password: 0 } } : {};

        const users = await getMongoClient()
            .collection(CollectionList.Users)
            .find(Query, passfilter)
            .sort({ createdAt: -1 })
            .toArray();
        return users;
    }
    public static async registerUser(userData: UserStruct) {
        const user = await getMongoClient().collection(CollectionList.Users).insertOne(userData).catch((err) => {
            throw new Error("Error registering user: " + err);
        });
        return user;
    }

    static async updateUser(data: UserStruct) {

        const userId = new ObjectId(data._id);
        const user = await this.findUser({ _id: userId });
        if (user.length == 0) {
            throw new AppError(alertList.userNotFound);
        }

        data._id = userId;
        data.updatedAt = new Date();

        // call to db to update user
        const result = await getMongoClient().collection(CollectionList.Users).updateOne({ _id: userId }, { $set: data }).catch((err: any) => {
            // throw new AppError("Error updating user: " + err);
            throw new AppError("Error updating user" + err);
        });
    }

    static async deleteUser(userId: string) {
        const id = new ObjectId(userId);
        // Check if user exists on db 
        const result = await getMongoClient().collection(CollectionList.Users).deleteOne({ _id: id }).catch((err: any) => {
            throw new AppError("Error deleting user: " + err);
        });

        if (result.deletedCount === 0) {
            throw new AppError(alertList.userNotFound);
        }
        return true;
    }
}