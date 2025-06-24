import {Model,DataTypes, Sequelize, InferAttributes, CreationOptional, InferCreationAttributes} from "sequelize"
import sequelize from "../connectDb"
import { Test } from "supertest"

class TestParameter extends Model<InferAttributes<TestParameter>, InferCreationAttributes<TestParameter>> {
    declare id : CreationOptional<number>;
    declare name : string;
    declare unit : string;
    declare referenceValue : string;
    declare serviceId : number 
}

TestParameter.init({
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
    serviceId : {
        type : DataTypes.INTEGER, 
        allowNull : false
    }
}, {
    timestamps : true, 
    tableName : "testParameter",
    modelName :"testParameter", 
    sequelize
})


export default TestParameter
