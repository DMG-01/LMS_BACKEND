import {DataType,Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, DateOnlyDataType, CreationOptional} from "sequelize"
import sequelize from "../connectDb"
import {patientTestTable as TestVisit,Service, TestParameter, TestResult, } from "./association"


class PatientTest extends Model<InferAttributes<PatientTest>, InferCreationAttributes<PatientTest>> {
    declare id: CreationOptional<number>
    declare patientId : number
    declare status : string
    declare dateTaken : string
    declare amountPaid : number


    public async getRegisterDetail() {
          try {
    
     const _register = await TestVisit.findOne({
            where : {
                id : this.id
            }, 
            include : [{
                model : Service, 
                as : "services", 
                include : [{
                    model :TestParameter,  
                    as : "parameters", 
                    include : [{
                        model : TestResult, 
                        as : "results"
                    }]
                }]
            }]
        })

        if(_register) {
            return {
                status : 1,
                register : _register
            }
        }

  }catch(error) {
    console.log(error)
    return {
        status :0, 
        error : error
    }
    
  }
  
    }


    public async changeAmountPaid(newAmountPaid : number) {
         this.amountPaid = newAmountPaid
         await this.save()
         return {
            success : 1, 
            msg :`amount has been changed to ${newAmountPaid}`
         }
    }

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