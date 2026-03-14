import { ObjectId } from "mongodb";
import { DateInterface } from "../tools/dateInterface.js";
import { BoldPaymentStatusType } from "../bold/boldPaymentStruct.js";

/**
 * //description
 * Represents the structure of an order in the store, including customer information,
 * shipping details, payment references, and order items.
 * Extends {@link DateInterface} to include date-related properties.
 *
 * @remarks
 * This class is used to encapsulate all relevant data for an order, including
 * optional fields for customer and shipping information, payment integration,
 * and additional notes.
 *
 * @property _id - Unique identifier for the order (MongoDB ObjectId).
 * @property email - Customer's email address.
 * @property phone - Customer's phone number.
 * @property firstName - Customer's first name.
 * @property lastName - Customer's last name.
 * @property address - Shipping address.
 * @property apartment - Apartment or suite number.
 * @property city - City for shipping.
 * @property department - Department or region for shipping.
 * @property postalCode - Postal code for shipping.
 * @property saveInfo - Indicates if customer wants to save their information.
 * @property shippingMethod - Selected shipping method.
 * @property productsSubtotal - Subtotal price of products.
 * @property shippingCost - Cost of shipping.
 * @property shippingMode - Mode of shipping.
 * @property shippingNote - Additional notes for shipping.
 * @property status - Current status of the order.
 * @property notes - Additional notes for the order.
 * @property items - List of items in the order.
 * @property paymentReferenceId - Reference ID for payment.
 * @property callbackUrl - URL to redirect the user after payment.
 * @property imgUrl - URL of the product image to show in the payment page.
 */
export class OrdersStruct extends DateInterface {
    _id?: ObjectId;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    apartment?: string;
    city?: string;
    department?: string;
    postalCode?: string;
    saveInfo?: boolean;
    shippingMethod?: string;
    productsSubtotal?: number;
    shippingCost?: number;
    shippingMode?: string;
    shippingNote?: string;
    status?: BoldPaymentStatusType;
    notes?: string;
    items?: OrderItem[];
    paymentReferenceId?: string;

    //Payments extra data 
    callbackUrl?: string;//Url to redirect the user after payment
    imgUrl?: string;//Url of the product image to show in the payment page

    constructor(data: OrdersStruct) {
        super(data);
        this._id = data._id;
        this.email = data.email?.trim();
        this.phone = data.phone?.trim();
        this.firstName = data.firstName?.trim();
        this.lastName = data.lastName?.trim();
        this.address = data.address?.trim();
        this.apartment = data.apartment?.trim();
        this.city = data.city?.trim();
        this.department = data.department?.trim();
        this.postalCode = data.postalCode?.trim();
        this.saveInfo = data.saveInfo;
        this.shippingMethod = data.shippingMethod;
        this.productsSubtotal = data.productsSubtotal;
        this.shippingCost = data.shippingCost;
        this.shippingMode = data.shippingMode;
        this.shippingNote = data.shippingNote;
        this.status = data.status;
        this.notes = data.notes;
        this.items = data.items;
        this.paymentReferenceId = data.paymentReferenceId;
        this.callbackUrl = data.callbackUrl;
        this.imgUrl = data.imgUrl;
    }

}


/**
 * Represents an item within an order, including product details, variant information,
 * quantity, pricing, and calculated line total.
 *
 * @property productId - Unique identifier for the product.
 * @property variantSku - SKU for the specific product variant.
 * @property size - Size of the product variant.
 * @property color - Color of the product variant.
 * @property quantity - Number of units ordered for this item.
 * @property unitPrice - Price per unit of the product.
 * @property lineTotal - Total price for this item (unitPrice * quantity).
 */
export interface OrderItem {
    productId: string;
    variantSku: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}