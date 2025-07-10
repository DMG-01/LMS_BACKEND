import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import sequelize from "../connectDb";
import { TestParameterTemplate, TestResult  } from "./association";
import Test from "supertest/lib/test";

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare testVisitId: number;
  declare serviceTemplateId: number; 

public async uploadResult(value: string, parameterTemplateId: number) {
  try {
    console.log(`checking for parameter template`);

    const _testParameterTemplate = await TestParameterTemplate.findOne({
      where: {
        serviceTemplateId: this.serviceTemplateId,
        id: parameterTemplateId,
      },
    });

    if (!_testParameterTemplate) {
      console.log(`parameter template not found`);
      return {
        status: 0,
        msg: `Parameter template with ID ${parameterTemplateId} not found for service template ${this.serviceTemplateId}`,
      };
    }

    console.log(`creating result`);
    const _testResult = await TestResult.create({
      serviceId: this.id,
      parameterId: _testParameterTemplate.id,
      value: value,
    });

    console.log(`result created`);
    return {
      success: 1,
      _testResult,
    };
  } catch (err) {
    console.error(`❌ Error in uploadResult():`, err);
    return {
      status: 0,
      msg: "An unexpected error occurred while uploading the result",
      error: err,
    };
  }
}

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
