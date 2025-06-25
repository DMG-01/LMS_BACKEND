import {Service, ServiceTemplate, TestParameterTemplate} from "../models/association"
import {Request, Response} from "express"
import statusCodes from "http-status-codes"
import Test from "supertest/lib/test"

const createNewServiceTemplate = async(req : Request, res : Response)=> {
        if(!req.body) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg : `missing required parameter`
            })
            
        }
        const {name, price} = req.body

        if(!name || !price) {
            res.status(statusCodes.BAD_REQUEST).json({
                msg :` missing required parameter`
            })
        }

        try {

            const newServiceTemplate = await ServiceTemplate.create({
                name , 
                price
            })

             res.status(statusCodes.CREATED).json({
                msg :"new service has been created", 
                newServiceTemplate
            })
            return

        }catch(error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                msg : "INTERNAL_SERVER_ERROR", 
                error:error
            })
        }

}


const changePrice = async(req : Request, res : Response) => {
      if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing request body`
        })
        return
      }

      const {serviceId, price} = req.body

      if(!serviceId || !price) {
        
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing required parameter`
        })
        return
      }

      try {

        const _serviceTemplate = await ServiceTemplate.findOne({
            where  : {
                id : serviceId
            }
        })

        if(!_serviceTemplate) {
            res.status(statusCodes.NOT_FOUND).json({
                msg : `no service with id ${serviceId} found`
            })
        }

        const priceChange = await _serviceTemplate?.changePrice(price)

        if(priceChange?.status === 1) {
            res.status(statusCodes.OK).json({
                msg :`price changed successful`, 
                newPrice : price
            })
        }
      }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`, 
            error : error
        })
      }
}

const addNewProperty = async(req : Request, res : Response) => {

    if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing req.body`
        })
        return
    }

    const {propertyName,serviceId,  propertyUnit,referenceValue} = req.body

    if(!propertyName  || !serviceId ||!propertyUnit || !referenceValue) {
        res.status(statusCodes.BAD_REQUEST).json ({
            msg : `missing required parameter`
        })
        return
    }

    try {
        const _service = await ServiceTemplate.findOne({
            where : {
                id  : serviceId
            }
        })

        if(!_service) {
            res.status(statusCodes.NOT_FOUND).json({
                msg :`no service with id ${serviceId}`
            })
            return
        }

            const response = await _service.addNewProperty(propertyName, propertyUnit, referenceValue)

            if(response?.status === 1) {
                res.status(statusCodes.OK).json({
                    msg :"new property added successfully", 
                    newProperty : response.newProperty
                })
                return
            }else if(response?.status === 0) {
                res.status(statusCodes.OK).json({
                    msg : response.msg, 
                })
            }

    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR`, 
            error : error
        })
    }
}


const removeProperty =  async (req :Request, res : Response)=> {
         if(!req.body) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing req.body`
        })
        return
    }

    const {serviceId, propertyId} = req.body
    if(!serviceId || !propertyId) {
        res.status(statusCodes.BAD_REQUEST).json({
            msg : `missing required parameter`
        })
        return
    } 

    try {

    const _service = await ServiceTemplate.findOne({
        where : {
            id : serviceId
        }
    })

    if(!_service) {
        res.status(statusCodes.NOT_FOUND).json ({
            msg : `no service with id ${serviceId} found`
        })
        return
    }


    const response = await _service.removeProperty(propertyId)

    if(response.success === 1) {
        res.status(statusCodes.OK).json({
            msg : response.msg, 
            propertyToRemove : response.propertyToRemove
        })
        return
    } else if(response.success === 0) {
        res.status(statusCodes.NOT_FOUND).json({
            msg : response.msg
        })
        return
    }
}catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        msg : `INTERNAL_SERVER_ERROR`, 
        error : error
    })
}
}

const getAllServices = async(req:Request, res : Response)=> {

    try {
        const _AllServices = await ServiceTemplate.findAll({
            include : [{
                model : TestParameterTemplate, 
                as : "serviceTemplateId"
            }]
        })

        if(_AllServices.length < 1) {
            res.status(statusCodes.NOT_FOUND).json({
                msg : `no service found`
            })
            return 
        }

        res.status(statusCodes.OK).json({
            _AllServices
        })
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg :`INTERNAL_SERVER_ERROR`, 
            error
        })
    }
}
  export {createNewServiceTemplate, removeProperty, changePrice,getAllServices, addNewProperty}


