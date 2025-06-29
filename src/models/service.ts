import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import sequelize from "../connectDb";
import { TestParameterTemplate,TestParameter, TestResult  } from "./association";
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

  public async  uploadResult(value : string, parameterTemplateId : number) {
 
    //result should have serviceId and parameter
    
    const _testParameterTemplate = await TestParameterTemplate.findOne({
      where : {
        serviceTemplateId : this.serviceTemplateId, 
        id : parameterTemplateId
      }
      })

      if(!_testParameterTemplate) {
        return {
          status : 0, 
          msg : `parameter template does not exist`
        }
      }

      // so here you dont need to create a new parameter
      /*
    const newParameter = await TestParameter.create({
        name : _testParameterTemplate.name, 
        unit : _testParameterTemplate.unit, 
        referenceValue : _testParameterTemplate.referenceValue, 
        testServiceId : this.id
    })
*/
    const _testResult = await TestResult.create({
      serviceId : this.id, 
      parameterId : _testParameterTemplate.id, 
      value : value
    })

    return {
      success : 1, 
      _testResult 
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
