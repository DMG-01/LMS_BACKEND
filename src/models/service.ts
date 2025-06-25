import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import sequelize from "../connectDb";
import TestParameter from "./testParamaeters";

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare testVisitId: number;
  declare serviceTemplateId: number; // ✅ This is the missing field
}

Service.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    testVisitId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    serviceTemplateId: {
      allowNull: false,
      type: DataTypes.INTEGER, // ✅ Added to match controller logic
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "Service",
    tableName: "services",
  }
);

export default Service;
