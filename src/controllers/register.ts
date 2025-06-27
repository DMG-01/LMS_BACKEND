import { Request, Response } from "express";
import statusCodes from "http-status-codes";
import {
  Patient,
  Service,
  patientTestTable as TestVisit,
  TestParameter,
  TestParameterTemplate,
  ServiceTemplate,
  sequelize,
  TestResult,
  
} from "../models/association";
import serviceTemplate from "../models/serviceTemplate";

interface PatientData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: string;
  amountPaid: number;
}


//register a patient ,check if they exist and create a profile for them if they dont
//check if the services parsed in the array are valid 
//if they are valid  create a register 
//loop through and link the registerid to the services 

const RegisterAPatient = async(req:Request, res : Response) => {

  if (!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({msg : `missing required parameter`})
    return
  }
  const {patientData, selectedTemplateIds} : {patientData : PatientData; selectedTemplateIds : number[]} = req.body

  if(!patientData||!selectedTemplateIds) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing required parameter`
    })
    return 
  }
  let _patient

  _patient = await Patient.findOne({
    where : {
      phoneNumber : patientData.phoneNumber, 
      firstName : patientData.firstName, 
      lastName : patientData.lastName
    }
  })

  if(!_patient) {
      _patient = await Patient.create({
        firstName : patientData.firstName, 
        lastName : patientData.lastName, 
        phoneNumber : patientData.phoneNumber, 
        email : patientData.email, 
        dateOfBirth : patientData.dateOfBirth,
      })
      console.log(`new patient created`)
  }

  let register = await  TestVisit.create({
    patientId : _patient.id,
    status : "uncompleted", 
    amountPaid : patientData.amountPaid, 
    dateTaken : new Date().toISOString().split("T")[0]
  })

  if(register) {

  for(let i = 0; i < selectedTemplateIds.length; i++) {
    const isServiceValid = await serviceTemplate.findOne({
      where : {
        id : selectedTemplateIds[i]
      }
    })

    if(isServiceValid) {
      await Service.create({
        name : isServiceValid.name, 
        price : isServiceValid.price, 
        testVisitId : register.id, 
        serviceTemplateId : isServiceValid.id
      })
    }
    else {
      continue
    }


  }

  res.status(statusCodes.CREATED).json({
    msg : `patient added to register successfully`, 
    register : await TestVisit.findOne({
      where : {
        id : register.id
      }, 
      include : [{
        model : Service, 
        as : "services"
      }]
    })
  })


} else {
  res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
    msg : ` an error occured while creating register`
  })
}
  
}

const returnARegisterDetail = async(req : Request, res : Response) => {

  try {
    
     const _register = await TestVisit.findOne({
            where : {
                id : req.params.registerId
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

         if(!_register) {
                    res.status(statusCodes.NOT_FOUND).json({
                        response :`${req.params.registerId} does not exist`
                    })
                    return
                }
        
                else {
                    res.status(statusCodes.OK).json({
                        register : _register
                    })
                }

  }catch(error) {
    console.log(error)
    res.status(statusCodes.BAD_REQUEST).json({
      msg :"INTERNAL_SERVER_ERROR"
    })
  }
  return
}

export {RegisterAPatient, returnARegisterDetail}
