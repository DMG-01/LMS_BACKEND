import {DataType,Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, DateOnlyDataType, CreationOptional} from "sequelize"
import sequelize from "../connectDb"
import {patientTestTable as TestVisit,Service, TestParameter, TestResult,ServiceTemplate } from "./association"


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

public  async removeService(serviceId : number){
    const serviceToRemove =await  Service.findOne({
        where : {
            id : serviceId, 
            testVisitId : this.id
        }
    })

    if(!serviceToRemove) {
        return {
            status : 0,
            msg : `no service of ${serviceId} EXIST in this register `
        }
    }

    await serviceToRemove.destroy()
    await this.save()

    return {
        status : 1, 
        msg : ` service with id ${serviceId} successfully removed from register number ${this.id}`
    }
}

public async addService(serviceId : number ) {

    const isServiceIdValid = await ServiceTemplate.findOne({
        where : {
            id : serviceId
        }
    })

    if(!isServiceIdValid) {
        return {
            status : 0, 
            msg : `${serviceId} is an invalid service id`
        }
    }

    const serviceExist = await Service.findOne({
        where : {
            testVisitId : this.id, 
            serviceTemplateId : isServiceIdValid.id
        }
    })

    let serviceToAdd
        if(!serviceExist) {
     serviceToAdd = await Service.create({
        name : isServiceIdValid.name, 
        price : isServiceIdValid.price, 
        testVisitId : this.id, 
        serviceTemplateId : isServiceIdValid.id
    })
}else {
    return {
        status : 0,
        msg : `serivice of id ${serviceId} already exist`
    }
}

    return {
        status : 1, 
        msg :`service of id ${serviceId} added successfully `,
        serviceToAdd
    }
}

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