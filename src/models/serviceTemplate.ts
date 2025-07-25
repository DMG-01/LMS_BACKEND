import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import sequelize from "../connectDb";
import {TestParameterTemplate, ServiceTemplate} from "./association"
import Test from "supertest/lib/test";


class serviceTemplate extends Model <InferAttributes<serviceTemplate>, InferCreationAttributes<serviceTemplate> >{

    declare id :  CreationOptional<number>
    declare name : string
    declare price : number 
   // declare serviceTemplateId : number


    public async changePrice(newPrice : number) {
         this.price = newPrice
         await this.save()
         return {
            status : 1
         }

    }


    public async addNewProperty(propertyName : string, propertyUnit : string, referenceValue : string ) {

    const isPropertyAvailable = await TestParameterTemplate.findOne({
        where : {
            serviceTemplateId : this.id, 
            name : propertyName, 
            unit : propertyUnit, 
            referenceValue : referenceValue
        }
    })

    if(isPropertyAvailable) {
        return {
            status : 0,
            msg :"property already exist"
        }
    }

    const newProperty = await TestParameterTemplate.create({
        name : propertyName, 
        unit : propertyUnit, 
        referenceValue : referenceValue, 
        serviceTemplateId : this.id
    })

    if(newProperty) {
        return {
            status :1, 
            newProperty
        }
    }

    }


    public async removeProperty(propertyId : number) {

        const propertyToRemove = await TestParameterTemplate.findOne({
            where : {
                id : propertyId, 
                serviceTemplateId : this.id
            }
        })

        if(propertyToRemove) {

            await propertyToRemove.destroy()
            return {
                success : 1,
                msg : "property has been removed", 
                propertyToRemove
            }
        }
        else {
            return  {
                successs : 0, 
                msg :"property NOT FOUND "
            }
        }
    }

    public async  editProperty(properties : any, propertyId : number) {

      const property = await TestParameterTemplate.findOne({
    where: {
        id: propertyId,
        serviceTemplateId: this.id
    }
});

if (!property) {
    return {
        success: 0,
        msg: "No matching property found"
    };
}

Object.assign(property, properties);
await property.save();

return {
    success: 1,
    msg: "Property successfully updated"
};


        
    }


    public async getServiceDetail() {

        const details = await ServiceTemplate.findOne({
            where : {
                id : this.id, 
                name : this.name, 
                price : this.name, 
                //serviceTemplateId : this.serviceTemplateId
            }, 
            include : [{
                model : TestParameterTemplate, 
            }]
        })
    }
}

serviceTemplate.init(
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
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: "ServiceTemplates",
    tableName: "serviceTemplates",
  }
);


export default serviceTemplate