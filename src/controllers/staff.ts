import express, {Request, Response} from "express"
import statusCodes from "http-status-codes"
import {patientTestTable as TestVisit,Service } from "../models/association"



const uploadResult = async(req:Request, res : Response)=> {

    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({msg :`missing request body`})
        return
    }

    try {
    const {testVisitNumber, serviceId,parameterTemplateId,  result} : {testVisitNumber : number , serviceId : number, result : any, parameterTemplateId:number} = req.body
    if(!testVisitNumber || !serviceId || result) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg :`missing required parameter`
        })
        return
    }

    const _serviceWithRegNo  = await Service.findOne({
        where : {
            testVisitId : testVisitNumber, 
            id : serviceId
        }
    })

    if(!_serviceWithRegNo) {
        res.status(statusCodes.NOT_FOUND).json({
            msg :`no service of id${serviceId} included in register of id ${_serviceWithRegNo} found`
        })
        return
    }

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

export default {uploadResult}
