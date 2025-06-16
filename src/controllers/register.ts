import statusCodes from "http-status-codes"
import {Request,Response} from "express"
import {Register} from "../models/association"

interface AuthRequest extends Request {
    user : {
        userId : string, 
    }
}

function registerAPatient(req : Request, res : Response) {

    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing request body`
        })
    }

    const {firstName, lastName, phoneNumber, email, services, amountPaid } = req.body


}