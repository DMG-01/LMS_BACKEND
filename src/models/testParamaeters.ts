import {Model,DataTypes, Sequelize, InferAttributes, CreationOptional, InferCreationAttributes} from "sequelize"
import sequelize from "../connectDb"
import { Test } from "supertest"

class TestParameter extends Model<InferAttributes<TestParameter>, InferCreationAttributes<TestParameter>> {
    declare id : CreationOptional<number>;
    declare testId : number;
    declare name : string;
    declare unit : string;
    declare referenceValue : string;
}

TestParameter.init({
    id : {
        primaryKey : true, 
        allowNull : false, 
        autoIncrement : true, 
        type : DataTypes.INTEGER
    }, 
    testId : {
        type : DataTypes.INTEGER,
        allowNull : false
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
    }
}, {
    timestamps : true, 
    tableName : "testParameter",
    modelName :"testParaneter", 
    sequelize
})


export default TestParameter
