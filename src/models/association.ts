import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import Patient from "./patient";
import Service from "./service";
import patientTestTable from "./patientTestTable";
import TestParameter from "./testParamaeters";
import TestResult from "./testResult";

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

Patient.hasMany(patientTestTable, { foreignKey: "patientId", as: "tests" });
patientTestTable.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

patientTestTable.hasMany(Service, { foreignKey: "testVisitId", as: "services" });
Service.belongsTo(patientTestTable, { foreignKey: "testVisitId", as: "visit" });
//test table should be linked to result 
Service.hasMany(TestParameter, { foreignKey: "serviceId", as: "parameters" });
TestParameter.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

TestParameter.hasMany(TestResult, { foreignKey: "parameterId", as: "results" });
TestResult.belongsTo(TestParameter, { foreignKey: "parameterId", as: "parameter" });

export { Patient, Service,patientTestTable, TestParameter, TestResult, sequelize };
