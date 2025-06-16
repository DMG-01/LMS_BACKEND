import statusCodes from "http-status-codes"
import {Request,Response} from "express"
import {Register, Patient, Service} from "../models/association"

interface AuthRequest extends Request {
    user : {
        userId : string, 
    }
}

interface Result {
  propertyValue: string;
  refValue: string;
  actualValue?: string;
}


interface ServiceInterface {
  serviceId: number;
  serviceName: string;
  price: number;
  result: Result[];
}

const registerAPatient = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(statusCodes.BAD_REQUEST).json({ msg: "Missing request body" });
    }

    const { firstName, lastName, phoneNumber, email, services, amountPaid, dateOfBirth } = req.body;

    if (!services || services.length < 1) {
      return res.status(statusCodes.BAD_REQUEST).json({ msg: "Add at least one service" });
    }

    let serviceIds: number[] = [];
    let results: Result[] = [];

    for (const serviceId of services) {
      const service = await Service.findOne({ where: { id: serviceId } });
      if (!service) {
        return res.status(statusCodes.BAD_REQUEST).json({ msg: `Invalid serviceId ${serviceId} parsed` });
      }

      serviceIds.push(serviceId);

      if (service.properties && Array.isArray(service.properties)) {
        for (const prop of service.properties) {
          results.push({
            propertyValue: prop.propertyValue,
            refValue: prop.refValue
          });
        }
      }
    }

    const newRegister = await Register.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      services: serviceIds,
      results,
      amountPaid
    });

    let patient = await Patient.findOne({ where: { phoneNumber } });

    if (!patient) {
      patient = await Patient.create({ firstName, lastName, phoneNumber, email, dateOfBirth });

      return res.status(statusCodes.OK).json({
        msg: "New patient has been registered",
        newRegister,
        newPatient: patient
      });
    }

    return res.status(statusCodes.OK).json({
      msg: "Patient has been registered",
      newRegister
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const addNewService = async (req:Request,res:Response)=> {
    try {   
                if(!req.body) {
                    res.status(statusCodes.BAD_REQUEST).json({
                        msg : `missing request body`
                    })
                }

                const {newServiceId } = req.body 
                if(!newServiceId) {
                    res.status(statusCodes.BAD_REQUEST) .json({
                        msg :`missing required parameter in body ${newServiceId}`
                    })
                }

            const _register = await Register.findOne({
                where : {
                    id:req.params.id
                }
            })

            if(!_register) {
                res.status(statusCodes.NOT_FOUND).json({
                    msg :`No register with id ${req.params.id} found`
                })
                return
            }

            _register.addService(newServiceId)
             res.status(statusCodes.OK).json({
                msg :`new service of id ${req.params.id} has been added`
            })
            return
    }catch(error) {
        console.error(error)
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            msg : `INTERNAL_SERVER_ERROR_OCCURED`, 
            error
        })
    }
}



export {registerAPatient, addNewService}