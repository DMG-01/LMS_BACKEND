import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

import Patient from "./patient";
import Service from "./service";
import patientTestTable from "./patientTestTable"; // aka TestVisit
import TestResult from "./testResult";
import TestParameterTemplate from "./testParameterTemplate";
import ServiceTemplate from "./serviceTemplate";
import Referral  from "./referral";
import Staff from "./staffs"




const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

//REFERRAL --> TEST VISIT

Referral.hasMany(patientTestTable, {foreignKey : "referralId", as : "tests" })
patientTestTable.belongsTo(Referral, {foreignKey :"referralId", as : "referral"})

// PATIENT -> TEST VISIT
Patient.hasMany(patientTestTable, { foreignKey: "patientId", as: "tests" });
patientTestTable.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

// TEST VISIT -> SERVICES
patientTestTable.hasMany(Service, { foreignKey: "testVisitId", as: "services" });
Service.belongsTo(patientTestTable, { foreignKey: "testVisitId", as: "visit" });

//STAFF  ->   RESULT

Staff.hasMany(TestResult, { foreignKey : "staffId", as : "testResult"})
TestResult.belongsTo(Staff, {foreignKey : "staffId,", as : "staff"})

// SERVICE -> RESULT 
Service.hasMany(TestResult, { foreignKey: "serviceId", as: "testResult" });
TestResult.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

// PARAMETER TEMPLATE -> RESULT
TestParameterTemplate.hasMany(TestResult, { foreignKey: "parameterId", as: "results" });
TestResult.belongsTo(TestParameterTemplate, { foreignKey: "parameterId", as: "parameter" });

// SERVICE TEMPLATE -> PARAMETER TEMPLATE
ServiceTemplate.hasMany(TestParameterTemplate, {
  foreignKey: "serviceTemplateId",
  as: "testParameters",
});
TestParameterTemplate.belongsTo(ServiceTemplate, {
  foreignKey: "serviceTemplateId",
  as: "testService",
});

// SERVICE TEMPLATE → SERVICE INSTANCE (FIXED)
ServiceTemplate.hasMany(Service, {
  foreignKey: "serviceTemplateId", // ✅ Corrected from testServiceId
  as: "serviceInstances",
});
Service.belongsTo(ServiceTemplate, {
  foreignKey: "serviceTemplateId", // ✅ Corrected from testServiceId
  as: "template",
});

export {
  Patient,
  Service,
  patientTestTable,
  TestResult,
  ServiceTemplate,
  TestParameterTemplate,
  Referral,
  Staff, 
  sequelize,
};
