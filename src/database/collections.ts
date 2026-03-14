export namespace CollectionList {
    export const Users = "users";
}

export type CollectionList = typeof CollectionList[keyof typeof CollectionList];
