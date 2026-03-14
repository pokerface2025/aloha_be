import * as mongodb from "mongodb"
import { Env } from "../envSetup.js";
import { DatabaseList } from "./databaseList.js";
import { CollectionList } from "./collections.js";

export function getMongoClient(dbName?: DatabaseList) {
    const DbName = dbName ?? Env.MONGODB;
    return DatabaseManager.mongoClient.db(DbName);
}

export function getCollection(collectionName: CollectionList, dbName?: DatabaseList) {

    let client: mongodb.MongoClient;

    client = DatabaseManager.mongoClient;

    if (!DatabaseManager.mongoClient) {
        const mongo = new mongodb.MongoClient(Env.MONGOURI);
        client = mongo.connect().catch((err) => {
            throw err;
        }) as unknown as mongodb.MongoClient;
        console.log("connected with mongoDB");
    }

    const db = client.db(dbName ?? Env.MONGODB);
    return db.collection(collectionName);
}

export class DatabaseManager {

    public static mongoClient: mongodb.MongoClient;

    /**
     * Initializes the connection to the MongoDB database.
     *
     * @param uri - The connection string (URI) for the MongoDB instance.
     *              This must not be an empty string; otherwise, an error will be logged.
     * @param dbName - The name of the database to connect to.
     * 
     * @remarks
     * This method establishes a connection to the MongoDB server using the provided URI.
     * If the URI is empty, the function logs an error message and does not proceed with the connection.
     * 
     * @throws Will throw an error if the connection to the MongoDB server fails.
     * 
     * @example
     * ```typescript
     * const uri = "mongodb://localhost:27017";
     * const dbName = "myDatabase";
     * await DatabaseManager.init(uri, dbName);
     * ```
     */
    public static async init(uri: string, dbName: string) {

        if (uri == "") {
            console.error("🔴 MongoDB URI is empty in the environment variables.");
            return;
        }

        const mongoApp = new mongodb.MongoClient(uri);
        this.mongoClient = await mongoApp.connect().catch((err) => {

            throw err;
        });

    }
}