import dotenv from "dotenv";
import { Sequelize } from "sequelize";

import Patient from "./patient";
import Service from "./service";
import patientTestTable from "./patientTestTable"; // aka TestVisit
import TestParameter from "./testParamaeters";
import TestResult from "./testResult";
import TestParameterTemplate from "./testParameterTemplate";
import ServiceTemplate from "./serviceTemplate";

dotenv.config();

const sequelize = new Sequelize(
  process.env.GUARD_DB_NAME!,
  process.env.GUARD_DB_USER!,
  process.env.GUARD_DB_PASS!,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

// PATIENT -> TEST VISIT
Patient.hasMany(patientTestTable, { foreignKey: "patientId", as: "tests" });
patientTestTable.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

// TEST VISIT -> SERVICES
patientTestTable.hasMany(Service, { foreignKey: "testVisitId", as: "services" });
Service.belongsTo(patientTestTable, { foreignKey: "testVisitId", as: "visit" });

// SERVICE -> PARAMETERS
Service.hasMany(TestParameter, { foreignKey: "serviceId", as: "parameters" });
TestParameter.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

// PARAMETER -> RESULT
TestParameter.hasMany(TestResult, { foreignKey: "parameterId", as: "results" });
TestResult.belongsTo(TestParameter, { foreignKey: "parameterId", as: "parameter" });

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
  TestParameter,
  TestResult,
  ServiceTemplate,
  TestParameterTemplate,
  sequelize,
};
