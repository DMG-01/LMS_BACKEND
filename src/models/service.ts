import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../connectDb";
import { ref } from "process";


interface Result {
  propertyValue: string;
  refValue: string;
}

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare properties: CreationOptional<Result[]> 
  declare price: number;

  public async addProperty(propertyValue: string, refValue: string) {
    const newProperty = {propertyValue, refValue}

   if (!this.properties) {
  this.properties = [];
}
this.properties.push(newProperty);
await this.save()
  }

  public async  changePricing(newPrice: number) {
    this.price = newPrice;
    await this.save()
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
    properties: {
      allowNull: true,
      type: DataTypes.JSON,  
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
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
