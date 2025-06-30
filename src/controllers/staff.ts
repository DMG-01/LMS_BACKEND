import express, {Request, Response} from "express"
import statusCodes from "http-status-codes"
import {patientTestTable as TestVisit, Service } from "../models/association"



const uploadResult = async (req:Request, res : Response)=> {

    try {
    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({msg :`missing request body`})
        return
    }

    console.log(`request body found`)
    
    const {testVisitNumber, serviceId,parameterTemplateId,  result} : {testVisitNumber : number , serviceId : number, result : any, parameterTemplateId:number} = req.body
    if(!testVisitNumber || !serviceId || !result || !parameterTemplateId) {
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
      id: serviceId,
      testVisitId: testVisitNumber
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
            msg :`no service of id ${serviceId} included in register of id ${testVisitNumber} found`
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



const editResult = async(req:Request, res:Response)=> {}

const getPatientHistory = async(req:Request, res :Response)=> {}

export  {uploadResult}
