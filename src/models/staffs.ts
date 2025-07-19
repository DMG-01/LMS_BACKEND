import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import sequelize from "../connectDb";


class Staff extends Model <InferAttributes<Staff>, InferCreationAttributes<Staff>> {
declare id : CreationOptional<number>
declare firstName : string
declare lastName : string
declare password : string 
declare phoneNumber : string 
declare hasManegerialRole : boolean
declare hasAccountingRole : boolean
}

Staff.init({
    id : {
        primaryKey : true, 
        allowNull :false, 
        autoIncrement : true, 
        type : DataTypes.INTEGER
    }, 
    firstName : {
        type : DataTypes.STRING, 
        allowNull : false, 
    },
    lastName : {
        type : DataTypes.STRING, 
        allowNull : false,
    }, 
    password : {
        type : DataTypes.STRING, 
        allowNull :false
    } , 
    phoneNumber : {
        type : DataTypes.STRING, 
        allowNull : false, 
    },
    hasManegerialRole : {
        type : DataTypes.BOOLEAN, 
        allowNull : false, 
        defaultValue : false
    }, 
    hasAccountingRole : {
        type : DataTypes.BOOLEAN, 
        allowNull : false, 
        defaultValue : false
    }
}, {
    sequelize, 
    modelName : "staffs", 
    tableName : "staffs", 
    timestamps : true
})

export default Staff