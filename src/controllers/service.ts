import statusCode from "http-status-codes";
import { Request, Response } from "express";
import { Service } from "../models/association"; 

const createService = async (req: Request, res: Response) => {
  try {
    const { name, price, properties }: { name: string; price: number; properties?: Record<string, string> } = req.body;

    if (!name || !price || !properties) {
      return res.status(statusCode.BAD_REQUEST).json({
        msg: "Missing required fields: name, price, or properties",
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
