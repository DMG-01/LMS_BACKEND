import {DataType,Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, DateOnlyDataType, CreationOptional} from "sequelize"
import sequelize from "../connectDb"


class PatientTest extends Model<InferAttributes<PatientTest>, InferCreationAttributes<PatientTest>> {
    declare id: CreationOptional<number>
    declare patientId : number
    declare testId : number
    declare status : string
    declare dateTaken : string


    public getResult() {}
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
    testId : {
        type :DataTypes.INTEGER, 
        allowNull : false
    }, 
    status : {
        type : DataTypes.ENUM("completed", "uncompleted"),
        defaultValue :"uncompleted", 
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