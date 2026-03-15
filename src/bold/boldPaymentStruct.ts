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
        this.image_url = data?.image_url || "";
        this.callback_url = data?.callback_url || "";
    }
}


export const BoldPaymentStatus = {
    ACTIVE: "El link está disponible para ser pagado. Esto puede suceder porque no se ha iniciado un pago o porque un pago anterior falló y el link está listo para ser usado nuevamente.",
    PROCESSING: "El pago está en curso y aún no se ha completado la transacción.",
    PAID: "El pago se ha realizado con éxito.",
    APPROVED: "El pago ha sido aprobado por el sistema de pagos, pero aún no se ha completado la transacción.",
    REJECTED: "El pago fue rechazado.",
    CANCELLED: "El pago fue cancelado por el usuario o fue fallido.",
    EXPIRED: "El link está vencido y no puede ser pagado."
};

export type BoldPaymentStatusType = keyof typeof BoldPaymentStatus;