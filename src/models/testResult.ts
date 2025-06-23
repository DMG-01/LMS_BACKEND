import {Model,DataTypes, Sequelize, InferAttributes, CreationOptional, InferCreationAttributes} from "sequelize"
import sequelize from "../connectDb"
import { Test } from "supertest"

class TestResult extends Model<InferAttributes<TestResult>, InferCreationAttributes<TestResult>> {
    declare id : number;
    declare parameterTestId : number;
    declare parameterId : number;
    declare value : string 
}


TestResult.init({
    id : {
        type :DataTypes.INTEGER, 
        primaryKey : true, 
        autoIncrement : true, 
        allowNull : false
    }, 
    parameterTestId : {
        type : DataTypes.INTEGER, 
        allowNull :false
    }, 
    parameterId : {
        type : DataTypes.INTEGER, 
        allowNull : false
    }, 
    value : {
        type : DataTypes.STRING, 
        allowNull : true
    }
}, {
        sequelize, 
        modelName : "testResult", 
        tableName : "testResult" , 
        timestamps : true   
    })



export default TestResult