import {DataType,Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize} from "sequelize"
import sequelize from "../connectDb"


class PatientTest extends Model<InferAttributes<PatientTest>, InferCreationAttributes<PatientTest>> {
    declare id: number
    declare patientId : number
    declare status : string
    declare dateTaken : string
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