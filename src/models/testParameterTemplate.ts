import {Model,DataTypes, Sequelize, InferAttributes, CreationOptional, InferCreationAttributes} from "sequelize"
import sequelize from "../connectDb"
import { Test } from "supertest"

class testParameterTemplate extends Model<InferAttributes<testParameterTemplate>, InferCreationAttributes<testParameterTemplate>> {
    declare id : CreationOptional<number>;
    declare name : string;
    declare unit : string;
    declare referenceValue : string;
    declare serviceTemplateId : number 
    
}

testParameterTemplate.init({
    id : {
        primaryKey : true, 
        allowNull : false, 
        autoIncrement : true, 
        type : DataTypes.INTEGER
    },
    name : {
        type : DataTypes.STRING, 
        allowNull : false
    }, 
    unit : {
        type : DataTypes.STRING, 
        allowNull : true 
    }, 
    referenceValue : {
        type:DataTypes.STRING, 
        allowNull : true,
        defaultValue : "none"
    }, 
    serviceTemplateId : {
        type : DataTypes.INTEGER, 
        allowNull : false
    }
}, {
    timestamps : true, 
    tableName : "testparametertemplate",
    modelName :"testParameterTemplate", 
    sequelize
})

export default testParameterTemplate
