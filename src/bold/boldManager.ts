import { CollectionList } from "../database/collections.js";
import { getMongoClient } from "../database/databaseManager.js";
import { BoldInvoiceStruct } from "./boldPaymentInvoiceStruct.js";
import { BoldPaymentStruct } from "./boldPaymentStruct.js";

export class boldManager {

    static async createPaymentData(data: { totalAmount: number, description: string, imgUrl?: string, email: string, callbackUrl?: string }) {

        const paymentData = new BoldPaymentStruct(
            {
                amount: {
                    total_amount: data.totalAmount
                },
                description: data.description,
                payer_email: data.email,

            }
        );

        if (data.imgUrl && data.imgUrl != "") {
            paymentData.image_url = data.imgUrl;
        }

        if (data.callbackUrl && data.callbackUrl != "") {
            paymentData.callback_url = data.callbackUrl;
        }

        console.log(data);

        return paymentData;
    }

    static async CreatePaymentLink(data: BoldPaymentStruct) {

        if (!process.env.BOLDKEY) {
            console.log("Error on bold Key")
            throw new Error("BOLDKEY environment variable is not set");
        }

        if (!data) {
            console.log("Error on payment data")
            throw new Error("Payment data is required");
        }

        if (data.callback_url?.includes("localhost") || data.callback_url?.includes("")) {
            data.callback_url = undefined;
        }

        const url = "https://integrations.api.bold.co/online/link/v1";
        const header: any = {
            Authorization: `x-api-key ${process.env.BOLDKEY}`,
        }
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const resError = await response.text();
            console.log("Error response from Bold API:", resError);
            throw new Error(`Failed to create payment link: ${response.statusText} , Response: ${resError}`);
        }

        let responseData: any = await response.text();

        try {
            responseData = JSON.parse(responseData);
        } catch (error) {
            console.log("Failed to parse response as JSON:", error);
            console.log("Response text:", responseData);
        }

        return responseData;
    }

    static async handleWebhook(data: any) {

        const boldInvoice = new BoldInvoiceStruct(data);

        const found = await getMongoClient("transactions").findOne({ "id": boldInvoice.id });

        if (found) {
            console.log("Invoice already exists in database, skipping insertion.");
            return;
        }

        await getMongoClient("transactions").insertOne(boldInvoice);
        
    }

}