import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import sequelize from "../connectDb";
import { ref } from "process";
import TestParameter from "./testParamaeters";


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
  declare price: number;

  public  async addnewProperties(propertyName : string, refValue : string, propertyUnit? : any) {

     let availableProp

     availableProp = await TestParameter.findOne({
      where : {
        testId : this.id, 
        name : propertyName
      }
    })

    if(!availableProp) {
      availableProp = await TestParameter.create({
        testId : this.id, 
        name : propertyName, 
        unit : propertyUnit, 
        referenceValue : refValue, 
      })

      return availableProp
    } else {
      throw new Error("property already exist")
    }

    

  }

  public async removeProperty(propertyId : number) {

    const propToDelete = await TestParameter.findOne({
      where : {
        id : propertyId
      }
    })
    if(propToDelete) {
    await propToDelete?.destroy()
    return "propery deleted"
  }else {
    throw new Error(`property of id ${propertyId} not found `)
  }
}

  public async getServiceDetail() {

    const serviceDetail = await Service.findOne({
      where : {
        id : this.id
      }, 
      include : [{
        model : TestParameter, 
        as : "parameters", 
        attributes : ["name", "unit", "referenceValue"]
      }], 
      attributes: ["name", "price",]
    })
    return serviceDetail

  }

  public async changePricing(newPrice : number) : Promise<number> {
    this.price = newPrice
    await this.save()
    return 1
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
  },
  {
    sequelize,
    timestamps: true,
    modelName: "Service",
    tableName: "services",
  }
);

export default Service;
