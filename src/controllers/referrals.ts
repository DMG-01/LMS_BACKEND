import {Referral, patientTestTable} from "../models/association"
import statusCodes from "http-status-codes"
import express , {Request, Response} from "express"
const returnAllReferral = async(req : Request, res : Response)=> {

    try {

        const allReferral = await Referral.findAll()

        if(!allReferral) {
            res.status(statusCodes.NOT_FOUND).json({
                msg : `referral found`
            })
            return
        }


        res.status(statusCodes.OK).json({
            allReferral
        })
        return
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : error
        })
        return
    }
    
}


const returnAReferralDetail = async(req : Request, res : Response)=> {

    try {
        const _referral = await Referral.findOne({
            where : {
                id : req.params.referralId
            }
        })

        if(!_referral) {
            res.status(statusCodes.NOT_FOUND).json({
                msg : `no referral with id ${req.params.referralId} found`
            })
            return
        }

        res.status(statusCodes.OK).json({
            _referral
        })
        return
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`
        })
        return
    }
}

const payDiscount = async(req : Request, res : Response)=> {

    try {
        
        const {amountToPay} = req.body
        if(!amountToPay) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg : `no amount parsed`
            })
            return
        }

        const _referral = await Referral.findOne({
            where : {
                id : req.params.id
            }
        })

        if(!_referral) {
            res.status(statusCodes.NOT_FOUND).json({msg :`No referral with id ${req.params.referralId} found`})
            return
        }

        const response =  await _referral.payDiscount(amountToPay)
        
        if(response.success === 1) {
            res.status(statusCodes.OK).json({
                msg : response.msg
            })
            return
        }
    }catch{
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`
        })
        return
    }
}

const returnReferralsVisitTable = async(req : Request, res :Response)=> {

    try {

        

        

        const referralVistTable = await patientTestTable.findAll({
            where : {
                referralId : req.params.referralId 
            }
        })

        if(!referralVistTable) {
            res.status(statusCodes.NOT_FOUND).json({
                msg : `no register with referral of id ${ req.params.referralId }`
            })
        }

        res.status(statusCodes.OK).json({
            referralVistTable
        })
        return

    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR_OCCURED`
        })
        return
    }
}

export {returnAllReferral, returnAReferralDetail, payDiscount, returnReferralsVisitTable}