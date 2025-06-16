import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes} from "sequelize"
import sequelize from "../connectDb"

class patient extends Model<
InferAttributes<patient>, 
InferCreationAttributes<patient>
> {
    declare id : CreationOptional<number>
    declare firstName : string
    declare lastName : string
    declare phoneNumber : string
    declare email : CreationOptional<string>
    declare dateOfBirth : CreationOptional<string>
}

patient.init({
     id : {
    type : DataTypes.INTEGER, 
    primaryKey : true, 
    autoIncrement : true, 
    allowNull : false
 }, 
 firstName : {
    type :DataTypes.STRING, 
    allowNull : false
 }, 
 lastName : {
    type :DataTypes.STRING, 
    allowNull : false
 }, 
 phoneNumber : {
    type : DataTypes.STRING, 
    allowNull : false
 },
 email : {
    type : DataTypes.STRING, 
    allowNull : true
 }, 
 dateOfBirth : {
    type: DataTypes.STRING, 
    allowNull : true
 }
}, {sequelize, 
    timestamps : true, 
    modelName: 'patient', 
    tableName : "patients"
})

export default patient