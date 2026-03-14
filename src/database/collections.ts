export namespace CollectionList {
    export const Users = "users";
    export const Payments = "payments";
    export const Transactions = "transactions";
    export const Orders = "orders";
}

export type CollectionList = typeof CollectionList[keyof typeof CollectionList];
