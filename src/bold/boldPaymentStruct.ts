export class BoldPaymentStruct {
    amount_type?: string;
    amount?: {
        total_amount?: number;
        taxes?: {
            type?: string;
            base?: number;
            value?: number;
        }[];
        tip_amount?: number;
        currency?: string;
    };
    reference?: string;
    description?: string;
    payment_methods?: string[];
    payer_email?: string;
    image_url?: string;
    callback_url?: string

    constructor(data?: BoldPaymentStruct) {
        this.amount_type = data?.amount_type ?? "CLOSE";
        this.amount = data?.amount;
        this.reference = data?.reference;
        this.description = data?.description;
        this.payment_methods = data?.payment_methods ?? [
            "CREDIT_CARD",
            "PSE",
            "BOTON_BANCOLOMBIA",
            "NEQUI"
        ];
        this.payer_email = data?.payer_email;
        this.image_url = data?.image_url||"";
        this.callback_url = data?.callback_url||"";
    }
}