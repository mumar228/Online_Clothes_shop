import { EntitySchema } from "typeorm";

export const SellerEntity = new EntitySchema({
  name: "Seller",
  tableName: "sellers",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 150,
      unique: true,
      nullable: false,
    },
    phone: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    role: {
      type: "varchar",
      default: "seller",
      nullable: false,
    },
    brandname: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    shopname: {
      type: "varchar",
      length: 100,
      unique: true,
      nullable: false,
    },
    subscriptionStatus: {
      type: "varchar",
      default: "inactive",
      nullable: false,
    },
    subscriptionExpiresAt: {
      type: "timestamp",
      nullable: true,
    },
    status: {
      type: "varchar",
      default: "active", 
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});