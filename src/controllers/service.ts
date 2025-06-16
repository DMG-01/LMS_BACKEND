import statusCode from "http-status-codes";
import { Request, Response } from "express";
import { Service } from "../models/association"; 


interface Property {
  propertyValue: string;
  refValue: string;
}

const createService = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      properties = [],
    }: { name: string; price: number; properties?: Property[] } = req.body;

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
      price,
      properties,
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

        _service.changePricing(newPrice)
        await _service.save()

         res.status(statusCode.OK).json({
            msg : `service with id ${id} pricing changed`
        })
        return

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

export {createService, changeServicePrice, getAllService};
