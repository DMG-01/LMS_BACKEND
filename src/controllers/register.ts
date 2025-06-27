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
    }
  })
  if(!_register) {
    res.status(statusCodes.NOT_FOUND).json({
      msg :`no testVist with id ${req.params.registerId} found`
    })
    return
  }
  const response = await _register.getRegisterDetail()
  if(response!.status === 1) {
    res.status(statusCodes.OK).json({
      msg :`detail of register of id ${req.params.registerId} found`, 
      register : response!.register
    })
  }  
  else {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error :response?.error
    })
  }}
  catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg : `INTERNAL_SERVER-ERROR`, 
      error
    })
  }
}


const changeARegisterPrice = async(req : Request, res : Response)=> {
  if(!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg :`missing request body`
    })
    return
  }


  const {newPrice} = req.body 

  if(!newPrice) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing required parameter `
    })
  }

  try {
    const _registerToChange = await TestVisit.findOne({
    where : {
      id : req.params.registerId
    }
  })

  if(!_registerToChange) {
    res.status(statusCodes.NOT_FOUND).json({
      msg : `no register of id ${req.params.registerId} found`
    })
    return
  }

  const response = await _registerToChange.changeAmountPaid(newPrice)
  res.status(statusCodes.OK).json({
    msg : response!.msg
  })
  return 
    
  }catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error
    })
  }
  
}

const removeServiceFromRegisterRow = async(req:Request, res : Response)=> {
  if(!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing request body`
    })
    return
  }

    const {serviceIdToRemove} =  req.body
try {
    if(!serviceIdToRemove) {
      res.status(statusCodes.BAD_REQUEST).json({
        msg : `missing required parameter`
      })
      return
    }

    const _registerRow = await TestVisit.findOne({
      where : {
        id : req.params.registerId
      }
    })

    if(!_registerRow) {
      res.status(statusCodes.NOT_FOUND).json({
        msg :`no row of id ${req.params.registerId}`
      })
      return
    }

    const response = await _registerRow.removeService(serviceIdToRemove)

    if(response.status === 0) {
      res.status(statusCodes.NOT_FOUND).json({msg : response.msg})
      return
    }

    if(response.status === 1) {
      res.status(statusCodes.OK).json({
        msg : response.msg
      })
      return
    }
  }catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error 
    })
  }
  }

  const addServiceToRegister = async (req:Request, res : Response) => {

    if(!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing request body`
    })
    return
  }

    const {serviceIdToAdd} =  req.body
try {
    if(!serviceIdToAdd) {
      res.status(statusCodes.BAD_REQUEST).json({
        msg : `missing required parameter`
      })
      return
    }

    const _registerRow = await TestVisit.findOne({
      where : {
        id : req.params.registerId
      }
    })

    if(!_registerRow) {
      res.status(statusCodes.NOT_FOUND).json({
        msg :`no row of id ${req.params.registerId}`
      })
      return

    }

    const response = await _registerRow.addService(serviceIdToAdd)

    if(response.status === 0 ) {
      
        res.status(statusCodes.BAD_REQUEST).json({
          msg : response.msg
        })
      return
    }

    if(response.status === 1) {
      res.status(statusCodes.OK).json({
        msg: response.msg,
        serviceIdToAdd 
      })
    }

  }
  catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg : `INTERNAL_SERVER_ERROR`
    })
  }
  }
export {RegisterAPatient,addServiceToRegister, removeServiceFromRegisterRow, changeARegisterPrice, returnARegisterDetail}
