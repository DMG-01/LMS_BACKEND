import statusCodes from "http-status-codes"
import {Patient, patientTestTable, Service, TestResult, TestParameterTemplate} from "../models/association"
import {Request, Response} from "express"
import patient from "../models/patient"
import Test from "supertest/lib/test"

const getAllPatient = async(req:Request, res :Response) => {

    try {
    const _allPatient = await Patient.findAndCountAll()
    if(!_allPatient) {
        res.status(statusCodes.NOT_FOUND).json({
            msg :`no patient exist in database`
        })
        return
    }

    return res.status(statusCodes.OK).json({
        patients : _allPatient
    })
}catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        msg : `INTERNAL_SERVER_ERROR`
    })
}
} 


const getAPatientHistory = async(req : Request, res : Response) => {

    try {

        const _patient = await Patient.findOne({
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
            }], 
        })


        if(!_patient) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                msg : `no patient with id  ${req.params.patientId} found`
            })
            return
        }


        res.status(statusCodes.OK).json({
            patient : _patient
        })

        
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_ERROR_OCCURED`
        })
    }
}


export {getAllPatient, getAPatientHistory}