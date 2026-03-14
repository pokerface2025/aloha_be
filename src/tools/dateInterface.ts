export class DateInterface {
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data?: any) {
        this.createdAt = data?.dateCreatedAt || new Date();
        this.updatedAt = data?.dateUpdatedAt || new Date();
    }
}