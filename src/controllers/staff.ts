import express, {Request, Response} from "express"
import statusCodes from "http-status-codes"
import {patientTestTable as TestVisit, Service, TestResult,Patient, patientTestTable, TestParameterTemplate  } from "../models/association"
import {Op} from "sequelize"
import Test from "supertest/lib/test"



const uploadResult = async (req:Request, res : Response)=> {

    try {
    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({msg :`missing request body`})
        return
    }

    console.log(`request body found`)
    
    const {serviceId,parameterTemplateId,  result} : {testVisitNumber : number , serviceId : number, result : any, parameterTemplateId:number} = req.body
    if( !serviceId || !result || !parameterTemplateId) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg :`missing required parameter`
        })
        return
    }

    console.log(`complete parameter`)

    let _serviceWithRegNo
    
try {
  console.log(`checking...`);
  _serviceWithRegNo = await Service.findOne({
    where: {
      id: serviceId
    }
  });
  console.log("found...", _serviceWithRegNo);
} catch (err) {
  console.error("❌ Error during findOne:", err);
  res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
    msg: "Error fetching service",
    error: err
  });
  return;
}

    console.log(`found...`)


    console.log(`checking for service...`)


    if(!_serviceWithRegNo) {
        console.log(`service with reg number not found`)
        res.status(statusCodes.NOT_FOUND).json({
            msg :`no service of id ${serviceId}  found`
        })
        return
    }
    console.log(`service with reg number found`)
    console.log(`awaiting response`)
    const response = await _serviceWithRegNo.uploadResult(result,parameterTemplateId)

    if(response.success == 1 ) {
        res.status(statusCodes.OK).json({
            result : response._testResult
        })
        return
    }

    else if(response.status == 0) {
        res.status(statusCodes.NOT_FOUND).json({
            msg : response.msg
        })
        return
    }

}catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        msg : error
    })
}



}



const editResult = async(req:Request, res:Response)=> {

    try {
    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg :`MISSING REQUEST BODY`
        })
        return
    }

    const {resultId, serviceId, newValue} = req.body
    if(!resultId || !serviceId || !newValue) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `MISSING REQUIRED PARAMETER`
        })
        return
    }

    const _result = await TestResult.findOne({
        where : {
            id : resultId, 
            serviceId : serviceId
        }
    })

    if(!_result) {
         res.status(statusCodes.NOT_FOUND).json({
            msg : `no result with corresponding id ${resultId} and serviceId ${serviceId} found`
        })
        return
    }

    console.log(_result.value)
    _result.value = newValue
   const newResult = await _result.save()
    console.log(newResult.value)

    res.status(statusCodes.OK).json({
        msg : `change successful`
    })
    return

}catch(error) {
    console.log(error)
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        msg : `INTERNAL_SERVER_ERROR`
    })
    return
}


}

const patientHistory = async(req : Request, res : Response ) =>  {

    try {
            const {firstName, lastName, phoneNumber, email} = req.query

            const where: any = {};

    if (firstName) where.firstName = { [Op.like]: `%${firstName}%` };
    if (lastName) where.lastName = { [Op.like]: `%${lastName}%` };
    if (phoneNumber) where.phoneNumber = { [Op.like]: `%${phoneNumber}%` };
    if (email) where.phoneNumber = { [Op.like]: `%${email}%` };


    const _patientHistory = await Patient.findAll({
        where, 
        include : [{
            model : patientTestTable, 
            as : "tests", 
            include : [{
                model : Service, 
                as : "services", 
                include : [{
                    model : TestResult, 
                    as : "testResult",
                    include : [{
                        model : TestParameterTemplate, 
                        as : "parameter"
                    }]
                }]
            }]
        }]
    })

    res.status(statusCodes.OK).json({
        _patientHistory
    })
    return
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`
        })
        return
    }
}

const returnAPatientHistory = async(req : Request, res : Response)=> {

    try {

        const patientHistory = await Patient.findOne({
            where : {
                id : req.params.patientId
            },
             include : [{
            model : patientTestTable, 
            as : "tests", 
            include : [{
                model : Service, 
                as : "services", 
                include : [{
                    model : TestResult, 
                    as : "testResult",
                    include : [{
                        model : TestParameterTemplate, 
                        as : "parameter"
                    }]
                }]
            }]
        }]
        })

        if(!patientHistory) {
            res.status(statusCodes.NOT_FOUND).json({
                msg : `no patient with id ${req.params.patientId} found`
            })
            return
        }

        res.status(statusCodes.OK).json({
            patientDetail : patientHistory
        })
        return


    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`
        })
    }
}



export  {uploadResult, editResult, patientHistory, returnAPatientHistory}
