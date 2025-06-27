import { Request, Response } from "express";
import statusCodes from "http-status-codes"
import {
  Patient,
  Service,
  patientTestTable as TestVisit,
  TestParameter,
  TestParameterTemplate,
  ServiceTemplate,
  sequelize,
  patientTestTable,
  TestResult
} from "../models/association";

interface PatientData {
    firstName : string, 
    lastName : string, 
    phoneNumber : string , 
    email?: string , 
    dateOfBirth?: string
    amountPaid : number
}

const RegisterAPatient  = async (req: Request, res: Response) => {
  const { patientData, selectedTemplateIds } : {patientData : PatientData, selectedTemplateIds : number[]} = req.body;

  if (!patientData || !Array.isArray(selectedTemplateIds) || selectedTemplateIds.length === 0) {
    return res.status(400).json({ message: "Invalid input. Please provide patient info and service IDs." });
  }

  const transaction = await sequelize.transaction();

  try {
    // Step 1: Check or create patient
    let patient = await Patient.findOne({ where: { phoneNumber: patientData.phoneNumber } });
    if (!patient) {
      patient = await Patient.create(patientData, { transaction });
    }

    // Step 2: Get valid service templates
    const validTemplates = await ServiceTemplate.findAll({
      where: { id: selectedTemplateIds }
    });

    if (validTemplates.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "No valid services found." });
    }

    // Step 3: Create a new test visit
    const today = new Date().toISOString().split("T")[0];

    const testVisit = await TestVisit.create({
      patientId: patient.id,
      dateTaken: today,
      status: "uncompleted",
      amountPaid : patientData.amountPaid,
    }, { transaction });

    // Step 4: Create services & copy their parameters
    const allServices = [];

    for (const template of validTemplates) {
      const newService = await Service.create({
        testVisitId: testVisit.id,
        serviceTemplateId: template.id,
        name: template.name,
        price: template.price
      }, { transaction });

      // Step 5: Copy parameters from template
      const templateParams = await TestParameterTemplate.findAll({
        where: { serviceTemplateId: template.id }
      });

      const newParams = templateParams.map(param => ({
        name: param.name,
        unit: param.unit,
        referenceValue: param.referenceValue,
        serviceTemplateId: template.id, 
        serviceId : newService.id
      }));

      await TestParameter.bulkCreate(newParams, { transaction });

      allServices.push(newService);
    }

    // Step 6: Commit transaction
    await transaction.commit();

    return res.status(201).json({
      message: "Test visit created successfully.",
      patientId: patient.id,
      testVisitId: testVisit.id,
      servicesCreated: allServices.length
    });

  } catch (error: any) {
    await transaction.rollback();
    console.error("Registration failed:", error);
    return res.status(500).json({
      message: "An error occurred while registering test.",
      error: error.message
    });
  }
};


const returnARegisterDetail = async(req : Request, res : Response) => {

  try {
    
     const _register = await patientTestTable.findOne({
            where : {
                id : req.params.registerId
            }, 
            include : [{
                model : Service, 
                as : "services", 
                include : [{
                    model :TestParameter,  
                    as : "parameters", 
                    include : [{
                        model : TestResult, 
                        as : "results"
                    }]
                }]
            }]
        })

         if(!_register) {
                    res.status(statusCodes.NOT_FOUND).json({
                        response :`${req.params.registerId} does not exist`
                    })
                    return
                }
        
                else {
                    res.status(statusCodes.OK).json({
                        register : _register
                    })
                }

  }catch(error) {
    console.log(error)
    res.status(statusCodes.BAD_REQUEST).json({
      msg :"INTERNAL_SERVER_ERROR"
    })
  }
  return
}

export {RegisterAPatient, returnARegisterDetail}
