import { Request, Response } from "express";
import {
  Patient,
  Service,
  patientTestTable as TestVisit,
  TestParameter,
  TestParameterTemplate,
  ServiceTemplate,
  sequelize,
} from "../models/association";

const RegisterAPatient  = async (req: Request, res: Response) => {
  const { patientData, selectedTemplateIds } = req.body;

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
      testId: validTemplates[0].id // optional: you can use the first template's ID or any other tracking value
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
        where: { testServiceId: template.id }
      });

      const newParams = templateParams.map(param => ({
        name: param.name,
        unit: param.unit,
        referenceValue: param.referenceValue,
        testServiceId: newService.id
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

export {RegisterAPatient}
