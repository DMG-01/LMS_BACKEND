import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import Register from "./register";
import Patient from "./patient";
import Service from "./service";

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

// PATIENT --< REGISTER
Patient.hasMany(Register, {
  foreignKey: "patientId",
  as: "registers",
});

Register.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

// REGISTER --< SERVICE
Register.hasMany(Service, {
  foreignKey: "registerId",
  as: "serviceRecords", // 🔁 renamed to avoid collision
});

Service.belongsTo(Register, {
  foreignKey: "registerId",
  as: "register",
});

export { Register, Patient, Service, sequelize };
