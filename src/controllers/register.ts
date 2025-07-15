import { Request, Response } from "express";
import statusCodes from "http-status-codes";
import { Op } from "sequelize";
import {
  Patient,
  Service,
  patientTestTable as TestVisit,
  Referral,
  TestParameterTemplate,
  ServiceTemplate,
  sequelize,
  TestResult,
  
} from "../models/association";
import serviceTemplate from "../models/serviceTemplate";

interface PatientData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: string;
  amountPaid: number;
}

const RegisterAPatient = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(statusCodes.BAD_REQUEST).json({ msg: "missing required parameter" });
  }

  const {
    patientData,
    selectedTemplateIds,
    referralName = null
  }: {
    patientData: PatientData;
    selectedTemplateIds: number[];
    referralName?: string | null;
  } = req.body;

  if (!patientData || !selectedTemplateIds) {
    return res.status(statusCodes.BAD_REQUEST).json({
      msg: "missing required parameter"
    });
  }

  try {
    // Find or create patient
    let _patient = await Patient.findOne({
      where: {
        phoneNumber: patientData.phoneNumber,
        firstName: patientData.firstName,
        lastName: patientData.lastName
      }
    });

    if (!_patient) {
      _patient = await Patient.create({
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        phoneNumber: patientData.phoneNumber,
        email: patientData.email,
        dateOfBirth: patientData.dateOfBirth
      });
      console.log("new patient created");
    }

    // Handle referral if provided
    let referralId: number | null = null;
    if (referralName) {
      let referral = await Referral.findOne({ where: { name: referralName } });
      if (!referral) {
        referral = await Referral.create({ name: referralName });
      }
      referralId = referral.id;
    }

    // Create test visit
    const register = await TestVisit.create({
      patientId: _patient.id,
      status: "uncompleted",
      amountPaid: patientData.amountPaid,
      referralId: referralId, // <-- Always included (either actual ID or null)
      dateTaken: new Date().toISOString().split("T")[0]
    });

    // Add services
    for (let i = 0; i < selectedTemplateIds.length; i++) {
      const isServiceValid = await serviceTemplate.findOne({
        where: { id: selectedTemplateIds[i] }
      });

      if (isServiceValid) {
        await Service.create({
          name: isServiceValid.name,
          price: isServiceValid.price,
          testVisitId: register.id,
          serviceTemplateId: isServiceValid.id
        });
      }
    }

    // Final response
    const fullRegister = await TestVisit.findOne({
      where: { id: register.id },
      include: [{
        model: Service,
        as: "services"
      }]
    });

    return res.status(statusCodes.CREATED).json({
      msg: "patient added to register successfully",
      register: fullRegister
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "an error occurred while creating register"
    });
  }
};

const returnARegisterDetail = async(req : Request, res : Response) => {
    
  try {
  const _register = await TestVisit.findOne({
    where : {
      id : req.params.registerId
    }
  })
  if(!_register) {
    res.status(statusCodes.NOT_FOUND).json({
      msg :`no testVist with id ${req.params.registerId} found`
    })
    return
  }
  const response = await _register.getRegisterDetail()
  if(response!.status === 1) {
    res.status(statusCodes.OK).json({
      msg :`detail of register of id ${req.params.registerId} found`, 
      register : response!.register
    })
  }  
  else {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error :response?.error
    })
  }}
  catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg : `INTERNAL_SERVER-ERROR`, 
      error
    })
  }
}


const changeARegisterPrice = async(req : Request, res : Response)=> {
  if(!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg :`missing request body`
    })
    return
  }


  const {newPrice} = req.body 

  if(!newPrice) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing required parameter `
    })
  }

  try {
    const _registerToChange = await TestVisit.findOne({
    where : {
      id : req.params.registerId
    }
  })

  if(!_registerToChange) {
    res.status(statusCodes.NOT_FOUND).json({
      msg : `no register of id ${req.params.registerId} found`
    })
    return
  }

  const response = await _registerToChange.changeAmountPaid(newPrice)
  res.status(statusCodes.OK).json({
    msg : response!.msg
  })
  return 
    
  }catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error
    })
  }
  
}

const removeServiceFromRegisterRow = async(req:Request, res : Response)=> {
  if(!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing request body`
    })
    return
  }

    const {serviceIdToRemove} =  req.body
try {
    if(!serviceIdToRemove) {
      res.status(statusCodes.BAD_REQUEST).json({
        msg : `missing required parameter`
      })
      return
    }

    const _registerRow = await TestVisit.findOne({
      where : {
        id : req.params.registerId
      }
    })

    if(!_registerRow) {
      res.status(statusCodes.NOT_FOUND).json({
        msg :`no row of id ${req.params.registerId}`
      })
      return
    }

    const response = await _registerRow.removeService(serviceIdToRemove)

    if(response.status === 0) {
      res.status(statusCodes.NOT_FOUND).json({msg : response.msg})
      return
    }

    if(response.status === 1) {
      res.status(statusCodes.OK).json({
        msg : response.msg
      })
      return
    }
  }catch(error) {
    console.log(error)
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error 
    })
    return
  }
  }

  const addServiceToRegister = async (req:Request, res : Response) => {

    if(!req.body) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg : `missing request body`
    })
    return
  }

    const {serviceIdToAdd} =  req.body
try {
    if(!serviceIdToAdd) {
      res.status(statusCodes.BAD_REQUEST).json({
        msg : `missing required parameter`
      })
      return
    }

    const _registerRow = await TestVisit.findOne({
      where : {
        id : req.params.registerId
      }
    })

    if(!_registerRow) {
      res.status(statusCodes.NOT_FOUND).json({
        msg :`no row of id ${req.params.registerId}`
      })
      return

    }

    const response = await _registerRow.addService(serviceIdToAdd)

    if(response.status === 0 ) {
      
        res.status(statusCodes.BAD_REQUEST).json({
          msg : response.msg
        })
      return
    }

    if(response.status === 1) {
      res.status(statusCodes.OK).json({
        msg: response.msg,
        serviceIdToAdd 
      })
    }

  }
  catch(error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg : `INTERNAL_SERVER_ERROR`
    })
  }
  }

const returnAllRegister = async (req: Request, res: Response) => {
  try {
    const { dateTaken, date, patientId } = req.query;
    const filters: any = {};

    if (dateTaken || date) {
      filters.dateTaken = dateTaken || date;
    }

    if (patientId) {
      filters.patientId = patientId;
    }

    const _registers = await TestVisit.findAll({
      where: {
        ...filters,
      },
      include: [
        { model: Patient, as: "patient" },
        {
          model: Service,
          as: "services",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      data: _registers,
      message: "Registers fetched successfully",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


const deleteARegister = async(req : Request, res : Response)=> {

  const _register = TestVisit.destroy({
    where : {
      id : req.params.testVisitId
    }
  })

  if(!_register) {
    res.status(statusCodes.NOT_FOUND).json({
      msg : `No register with test id ${req.params.testVisitId} found`
    })
    return
  }

  res.status(statusCodes.OK).json({
    msg : `testVisit with id ${req.params.testVisitId} deleted`
  })
  return
}
export {RegisterAPatient,addServiceToRegister,deleteARegister, removeServiceFromRegisterRow, returnAllRegister, changeARegisterPrice, returnARegisterDetail}
