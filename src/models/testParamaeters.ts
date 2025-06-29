import {Model, InferAttributes, InferCreationAttributes,CreationOptional, DataTypes ,CreationAttributes  } from "sequelize"
import sequelize from "../connectDb"
import testParameterTemplate from "./testParameterTemplate";
class TestParameter extends Model<
  InferAttributes<TestParameter>,
  InferCreationAttributes<TestParameter>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare unit: string;
  declare referenceValue: string;
  declare testServiceId: number; // ✅ MUST match init below
}

TestParameter.init({
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referenceValue: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "none",
  },
  testServiceId: { // ✅ Make sure this matches above
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: "TestParameterTemplate",
  tableName: "testParameterTemplates",
  timestamps: true,
});

export default TestParameter