import statusCode from "http-status-codes";
import { Request, Response } from "express";
import { Service } from "../models/association"; 



const createService = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price
    }: { name: string; price: number } = req.body;

    if (!name || typeof price !== "number") {
      return res.status(statusCode.BAD_REQUEST).json({
        msg: "Missing or invalid required fields: name and price are required",
      });
    }

    const _serviceExist = await Service.findOne({
      where: { name },
    });

    if (_serviceExist) {
      return res.status(statusCode.CONFLICT).json({
        msg: `Service with name "${name}" already exists.`,
      });
    }

    const newService = await Service.create({
      name,
      price
    });

    return res.status(statusCode.CREATED).json({
      msg: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error occurred",
    });
  }
};

const changeServicePrice = async(req:Request, res : Response) => {

    if(!req.body) {
        res.status(statusCode.BAD_REQUEST).json({
            msg:"missing request body"
        })
        return 
    }
    try {
        const {id, newPrice} : {id:number, newPrice:number} = req.body

        const _service = await Service.findOne({
            where : {
                id 
            }
        })

        if(!_service) {
            res.status(statusCode.NOT_FOUND).json({
                msg:`no service with id ${id} found`
            })
            return
        }

       const priceChange =await  _service.changePricing(newPrice)
      
          if(priceChange === 1) {
         res.status(statusCode.OK).json({
            msg : `service with id ${id} pricing changed`
        })
        return
      }
        
    }catch(error) {
        console.error(`Error Changing service price : ${error}`)
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error occurred",
    }); 
    return
    }
}

const getAllService = async(req : Request, res : Response) => {
    try {

        const allService = await Service.findAll()
        res.status(statusCode.OK).json({
            allService
        })
        return
    
    }catch(error) {
        console.error(error)
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            msg :`Internal error occured ${error}`
        })
        return
    }
}

const addNewPropertyToService = async(req :Request, res : Response)=> {
  
  try {

    const {serviceId, newPropertyName , newPropertyRefValue, newPropertyUnit } = req.body

    const _service = await Service.findOne({
      where : {
        id : serviceId
      }
    })

    if(!_service) {
      res.status(statusCode.NOT_FOUND).json({
        msg : `service with id ${serviceId} not found`
      })
      return
    }
    console.log('adding new parameters')
    const newService = await _service?.addnewProperties(newPropertyName, newPropertyRefValue, newPropertyUnit)
     if(newService) {
      res.status(statusCode.OK).json({
        newPropery : newService
      })
     }
  }catch(error) {
    console.log(error)
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({error})
    throw new Error("INTERNAL_SERVER_ERROR")
     
  }
}

const removePropertyToService = async(req:Request, res : Response) => {

  try {
    const {serviceId, propertyId} = req.body

    if(!serviceId || !propertyId) {
      res.status(statusCode.BAD_REQUEST).json({
        msg : "missing required parameter"
      })
      return
    }

    const _service = await Service.findOne({
      where : {
        id : serviceId
      }
    })

    if(!_service) {
      res.status(statusCode.NOT_FOUND).json({
        msg : `nno service with id ${serviceId} found`
      })
    }

    const deleted = await _service?.removeProperty(propertyId)
    if(deleted === "propery deleted") {
      res.status(statusCode.OK).json({
        msg : deleted
      })
    }

  }catch(error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      error
    })
    throw new Error("INTERNAL_SERVER_ERROR")
  }
}


const returnServiceDetail = async(req :Request, res :Response)=> {

  try {
    const _service = await Service.findOne({
      where : {
        id : req.params.serviceId
      }
    }) 

    if(!_service) {
      res.status(statusCode.NOT_FOUND).json({
        msg : `no service with id ${req.params.id} found`
      })
      return
    }
    const _serviceDetail = await _service.getServiceDetail()

    return res.status(statusCode.OK).json({
      _serviceDetail
    })

  }catch(error) {
    console.log(error)
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      msg : "INTERNAL_SERVER_ERROR"
    })
  }
}

export {createService,returnServiceDetail,removePropertyToService, changeServicePrice, getAllService, addNewPropertyToService};
