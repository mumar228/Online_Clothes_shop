import { EntitySchema } from "typeorm";

export const ClothesEntity = new EntitySchema({
  name: "Clothes",
  tableName: "clothes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    brand: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    size: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    brandcountry: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    price: {
      type: "int",
      nullable: false,
    },
    stock: {
      type: "int",
      nullable: false,
    },
    color: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    about: {
      type: "varchar",
      length: 150,
      nullable: true,
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
