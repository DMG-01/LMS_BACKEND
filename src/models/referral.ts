import {InferAttributes,Model,  InferCreationAttributes, DataType, CreationOptional, DataTypes} from "sequelize"
import sequelize from "../connectDb"
class Referral extends Model<InferAttributes<Referral>, InferCreationAttributes<Referral>>  {
    declare id : CreationOptional<number>
    declare name : string
    declare totalAllocatedDiscount : CreationOptional<number>
    declare totalDiscountPayed : CreationOptional<number>
    declare accountNumber : CreationOptional<number>
    declare bankName : CreationOptional<number>
    declare referralId : CreationOptional<number>
}

Referral.init({
    id : {
        autoIncrement : true, 
        type : DataTypes.INTEGER, 
        primaryKey : true, 
        allowNull : false
    }, 

    name : {
        type : DataTypes.STRING, 
        allowNull : false
    }, 
    totalAllocatedDiscount : {
        type : DataTypes.FLOAT, 
        allowNull : false, 
        defaultValue : 0
    }, 
    totalDiscountPayed :  {
        type : DataTypes.FLOAT, 
        allowNull : false, 
        defaultValue : 0
    }, 
    accountNumber : {
        type : DataTypes.INTEGER, 
        allowNull : true
    }, 
    bankName : {
        type : DataTypes.STRING, 
        allowNull : true
    },
    referralId : {
        type : DataTypes.INTEGER, 
        allowNull :  true
    }


}, {
    sequelize, 
    timestamps : true, 
    tableName : "referral", 
    modelName : "referral", 
})


export default Referral