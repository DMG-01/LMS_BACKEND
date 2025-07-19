import statusCodes from "http-status-codes"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {Staff} from "../models/association"
import {Request, Response} from "express"



const superSignUp = async(req : Request, res : Response)=> {

    try {

        if(!req.body) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg : `MISSING REQUEST BODY`
            })
            return
        }

        const {firstName, lastName, phoneNumber, password} = req.body

        if(!firstName || !lastName || !phoneNumber || !password ) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg : `MISSING REQUIRED PARAMETER`
            })
            return
        }

        const salt =await  bcrypt.genSalt(10)
        const encodedPassword = await bcrypt.hash(password, salt)
        const _isFirstStaff = await Staff.findAndCountAll()
         if(_isFirstStaff.count > 0) {
            res.status(statusCodes.UNAUTHORIZED).json({
                msg : `UNAUTHORIZED`
            })
            return 
         }
         else {
            const firstStaff = await Staff.create({
                firstName, 
                lastName, 
                phoneNumber, 
                password : encodedPassword
            })
            await firstStaff.save()

            res.status(statusCodes.ACCEPTED).json({
                msg : `sign up successful`, 
                staff : {
                    firstName : firstStaff.firstName, 
                    lastName : firstStaff.lastName, 
                    phoneNumber : firstStaff.phoneNumber
                }
            })
            return
         }
        

    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            smg : `INTERNAL_SERVER_ERROR`
        })
        return
    }

}

const staffLogin = (req: Request , res : Response)=> {

    try {
        

    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`, 
        })
        return 
    }
}

const registerANewStaff = ()=> {}

const removeAStaff = ()=> {}



export {superSignUp}

