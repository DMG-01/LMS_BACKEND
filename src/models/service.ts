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

  public async addnewProperties(propertyName: string, refValue: string, propertyUnit?: any) {
    let availableProp = await TestParameter.findOne({
      where: {
        testServiceId: this.id,
        name: propertyName,
      },
    });

    if (!availableProp) {
      availableProp = await TestParameter.create({
        testServiceId: this.id,
        name: propertyName,
        unit: propertyUnit,
        referenceValue: refValue,
      });

      return availableProp;
    } else {
      throw new Error("Property already exists");
    }
  }

  public async removeProperty(propertyId: number) {
    const propToDelete = await TestParameter.findOne({
      where: {
        id: propertyId,
      },
    });

    if (propToDelete) {
      await propToDelete.destroy();
      return "Property deleted";
    } else {
      throw new Error(`Property with id ${propertyId} not found`);
    }
  }

  public async getServiceDetail() {
    const serviceDetail = await Service.findOne({
      where: {
        id: this.id,
      },
      include: [
        {
          model: TestParameter,
          as: "parameters",
          attributes: ["name", "unit", "referenceValue"],
        },
      ],
      attributes: ["name", "price"],
    });

    return serviceDetail;
  }

  public async changePricing(newPrice: number): Promise<number> {
    this.price = newPrice;
    await this.save();
    return 1;
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
