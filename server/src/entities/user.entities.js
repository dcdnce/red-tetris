import { EntitySchema } from "typeorm";

export class User {
    constructor(id, firstName, lastName, isActive) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
    }
}

export const UserSchema = new EntitySchema({
    name: "User",
    target: User,
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        firstName: {
            type: "text",
        },
        lastName: {
            type: "text",
        },
        isActive: {
            type: "boolean",
            default: true,
        },
    },
});
