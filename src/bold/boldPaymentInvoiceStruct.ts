import { ObjectId } from "mongodb";

// Notification Type Enums
export enum BoldNotificationType {
    SALE_APPROVED = "SALE_APPROVED",
    SALE_REJECTED = "SALE_REJECTED",
    VOID_APPROVED = "VOID_APPROVED",
    VOID_REJECTED = "VOID_REJECTED",
}

export enum TaxType {
    VAT = "VAT", // Impuesto al valor agregado
    CONSUMPTION = "CONSUMPTION", // Impuesto al consumo
}

export enum CardCaptureMode {
    CHIP = "CHIP",
    CONTACTLESS_CHIP = "CONTACTLESS_CHIP",
}

export enum CardBrand {
    VISA = "VISA",
    VISA_ELECTRON = "VISA_ELECTRON",
    MASTERCARD = "MASTERCARD",
    MAESTRO = "MAESTRO",
    AMERICAN_EXPRESS = "AMERICAN_EXPRESS",
    CODENSA = "CODENSA",
    DINERS = "DINERS",
    DISCOVER = "DISCOVER",
    TUYA = "TUYA",
    SODEXO = "SODEXO",
    OLIMPICA = "OLIMPICA",
    UNKNOWN = "UNKNOWN",
}

export enum CardType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT",
}

export enum PaymentMethod {
    CARD = "CARD",
    SOFT_POS = "SOFT_POS",
}

export enum IntegrationType {
    POS = "POS",
    SOFT_POS = "SOFT_POS",
    API_INTEGRATIONS = "API_INTEGRATIONS",
}

// Type Definitions
export interface TaxInfo {
    base: number;
    type: TaxType | string;
    value: number;
}

export interface AmountInfo {
    currency: string; // ISO 4217
    total: number;
    taxes: TaxInfo[];
    tip: number;
}

export interface CardInfo {
    capture_mode: CardCaptureMode | string;
    brand: CardBrand | string;
    cardholder_name: string;
    terminal_id: string;
    masked_pan: string;
    installments: number;
    card_type: CardType | string;
}

export interface NotificationData {
    payment_id: string;
    merchant_id: string;
    created_at: string; // ISO 8601 with timezone America/Bogotá
    amount: AmountInfo;
    user_id: string | null;
    metadata: {
        reference: string;
    };
    bold_code: string;
    payer_email: string;
    payment_method: PaymentMethod | string;
    card?: CardInfo;
    approval_number?: string;
    integration?: IntegrationType | string;
}

export class BoldInvoiceStruct {
    _id?: ObjectId;
    id?: string;
    type?: BoldNotificationType | string;
    subject?: string; // Bold transaction ID
    source?: string;
    spec_version?: string; // CloudEvents specification version
    time?: number; // POSIX timestamp
    data?: NotificationData;
    datacontenttype?: string;

    constructor(data?: BoldInvoiceStruct) {
        this._id = data?._id;
        this.id = data?.id;
        this.type = data?.type;
        this.subject = data?.subject;
        this.source = data?.source;
        this.spec_version = data?.spec_version;
        this.time = data?.time;
        this.data = data?.data;
        this.datacontenttype = data?.datacontenttype;
    }
}