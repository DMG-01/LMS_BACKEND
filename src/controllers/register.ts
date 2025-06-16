import statusCodes from "http-status-codes"
import {Request,Response} from "express"
import {Register, Patient} from "../models/association"

interface AuthRequest extends Request {
    user : {
        userId : string, 
    }
}

const registerAPatient = async(req : Request, res : Response) => {

    //check for service
    try {
    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing request body`
        })
    }

    const {firstName, lastName, phoneNumber, email, services, amountPaid, dateOfBirth } = req.body

    const newRegister = await Register.create({
        firstName, 
        lastName, 
        phoneNumber, 
        email, 
        services, 
        amountPaid
    })

    const newPatient = await Patient.findOne({
        where : {
            phoneNumber 
        }
    })

    if(!newPatient) {
        const newPatient = await Patient.create({
            firstName, 
            lastName, 
            phoneNumber, 
            email,
            dateOfBirth 
        })
           res.status(statusCodes.OK).json({
        msg:`new patient has been registered`,
        newRegister, 
        newPatient
    })
    return

    }

    return res.status(statusCodes.OK).json({
        msg:`patient has been registered`, 
        newRegister
    })
}catch(error) {
    console.log(error)
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        error : error
    })
}


}