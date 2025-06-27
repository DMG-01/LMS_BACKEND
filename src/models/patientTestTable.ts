import {DataType,Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, DateOnlyDataType, CreationOptional} from "sequelize"
import sequelize from "../connectDb"
import {patientTestTable,Service, TestParameter, TestResult} from "./association"


class PatientTest extends Model<InferAttributes<PatientTest>, InferCreationAttributes<PatientTest>> {
    declare id: CreationOptional<number>
    declare patientId : number
    declare status : string
    declare dateTaken : string
    declare amountPaid : number

//function to remove a service from a table
//function to modify the amount paid

}
PatientTest.init({

    id : {
        autoIncrement: true, 
        primaryKey : true, 
        type : DataTypes.INTEGER, 
        allowNull : false
    }, 
    patientId : {
        type: DataTypes.INTEGER, 
        allowNull : false
    }, 
    status : {
        type : DataTypes.ENUM("completed", "uncompleted"),
        defaultValue :"uncompleted", 
        allowNull : false
    }, 
    amountPaid : {
        type : DataTypes.INTEGER, 
        allowNull : false
    }, 
    dateTaken : {
        type : DataTypes.DATEONLY, 
        allowNull : false
    }
}, {
    sequelize, 
    modelName : "patientTestTable", 
    tableName :"patientTestTable", 
    timestamps : true
})

export default PatientTest