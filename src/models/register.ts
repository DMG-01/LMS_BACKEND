import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes} from "sequelize"
import sequelize from "../connectDb"

class register extends Model<
InferAttributes<register>, 
InferCreationAttributes<register>
>
 {
    declare id : CreationOptional<number>
    declare firstName :string
    declare lastName : string
    declare phoneNumber : string
    declare email : CreationOptional<string>
    declare services : CreationOptional<object>
    declare amountPaid : CreationOptional<number>
    declare supposedAmountPaid : CreationOptional<number>
}

register.init( {
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
services: {
  type: DataTypes.JSON, 
  allowNull: false
},
 amountPaid : {
    type : DataTypes.INTEGER, 
    allowNull : false
 }, 
 supposedAmountPaid : {
    type :DataTypes.INTEGER, 
    allowNull : true
 }
}, {
    sequelize, 
    timestamps : true, 
    modelName : "register", 
    tableName : "register"
})

export default register