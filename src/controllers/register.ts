import { DATEONLY } from "sequelize"
import {Patient, Service,patientTestTable, TestParameter, TestResult} from "../models/association"

interface patientPayLoad {
    firstName : string, 
    lastName : string, 
    phoneNumber : string, 
    email? : string
    dateOfBirth? : string, 
    servicesId : number[]
}

const RegisterAPatient = async(payload : patientPayLoad) => {

    const {firstName, lastName, phoneNumber, email, dateOfBirth, servicesId } = payload 
            
    try {

        let _patient = await Patient.findOne({
            where : {
                phoneNumber : phoneNumber
            }
        })

        if(!_patient) {

             _patient = await Patient.create({
                firstName : firstName, 
                lastName : lastName, 
                phoneNumber : phoneNumber, 
                email, 
                dateOfBirth
            })
        }
            
              for (let i = 0; i<servicesId.length;i++) {
                        const validTestId = await Service.findOne({where : {
                            id : servicesId[i]
                        }})

                        if(validTestId)  {
                        const newPatientTest = await patientTestTable.create({
                            patientId : _patient.id, 
                            testId : validTestId.id, 
                            status :"uncompleted", 
                            dateTaken : new DATEONLY()
                        })
                          
                    }
                    }
                    const totalCount = await Patient.findAndCountAll({
                        where : {
                            phoneNumber 
                        }
                    })
                    console.log(totalCount)
                    return  await  Patient.findAll({
                        where : {
                            phoneNumber : phoneNumber,
                            id : totalCount
                        }, 
                        include :[{
                            model : patientTestTable, 
                            as : "tests", 
                            where : {
                              dateTaken : new DATEONLY()
                            },
                            include : [{
                                model : Service, 
                                as :"services", 
                                include : [{
                                    model : TestParameter, 
                                    as :"parameters", 
                                    include : [{
                                        model : TestResult, 
                                        as :"results"
                                    }]
                                }]
                            }]

                        }]
                    })
    
                 }catch(error) {
                    throw new Error(`${error}`)
                 }
        
        throw new Error("missing required paramater")
    }

export {RegisterAPatient}