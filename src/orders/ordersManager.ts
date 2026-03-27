import { ObjectId } from "mongodb";
import { OrdersStruct } from "./ordersStruct.js";
import { BoldPaymentStruct } from "../bold/boldPaymentStruct.js";
import { boldManager } from "../bold/boldManager.js";
import { getCollection, getMongoClient } from "../database/databaseManager.js";
import { CollectionList } from "../database/collections.js";

export class OrdersManager {

    static async registerAOrder(orderData: any) {

        const order = new OrdersStruct(orderData);

        order._id = new ObjectId();
        order.createdAt = new Date();
        order.updatedAt = new Date();

        let totalAmount = 0;
        order.items?.forEach(item => {
            totalAmount += item.lineTotal
        });

        const boldPayment: BoldPaymentStruct = {
            amount_type: "CLOSE",
            amount: {
                total_amount: totalAmount + (order.shippingCost || 0)
            },
            reference: order._id.toString(),
            description: `${order.firstName} ${order.lastName} Orden: #${order._id.toString()}`,
            payer_email: order.email,
            callback_url: order.callbackUrl,
            // image_url: order.imgUrl
        }

        const { payload } = await boldManager.CreatePaymentLink(boldPayment);

        order.paymentReferenceId = payload.payment_link;
        order.status = "ACTIVE"

        await getCollection("orders").insertOne(order);

        console.log("Bold Link: ");
        return { link: payload.url };
    }

    static createOrder(order: any) {

    }

    static async getOrdersList(query: any) {

        if (query && query["_id"]) {
            query._id = new ObjectId(query._id);
        }

        const result = await getCollection("orders").find(query).sort({ createdAt: -1 }).toArray();

        return result;

    }

    static async updateOrder(data: any) {

        if (data["_id"]) {
            data._id = new ObjectId(data._id);
        }

        const result = await getCollection("orders").updateOne(
            { _id: data._id },
            { $set: data }
        );

        return result;
    }
}