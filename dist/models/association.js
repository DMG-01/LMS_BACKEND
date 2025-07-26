"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Staff = exports.Referral = exports.TestParameterTemplate = exports.ServiceTemplate = exports.TestResult = exports.patientTestTable = exports.Service = exports.Patient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize_1 = require("sequelize");
const patient_1 = __importDefault(require("./patient"));
exports.Patient = patient_1.default;
const service_1 = __importDefault(require("./service"));
exports.Service = service_1.default;
const patientTestTable_1 = __importDefault(require("./patientTestTable")); // aka TestVisit
exports.patientTestTable = patientTestTable_1.default;
const testResult_1 = __importDefault(require("./testResult"));
exports.TestResult = testResult_1.default;
const testParameterTemplate_1 = __importDefault(require("./testParameterTemplate"));
exports.TestParameterTemplate = testParameterTemplate_1.default;
const serviceTemplate_1 = __importDefault(require("./serviceTemplate"));
exports.ServiceTemplate = serviceTemplate_1.default;
const referral_1 = __importDefault(require("./referral"));
exports.Referral = referral_1.default;
const staffs_1 = __importDefault(require("./staffs"));
exports.Staff = staffs_1.default;
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: "localhost",
    dialect: "mysql",
});
exports.sequelize = sequelize;
//REFERRAL --> TEST VISIT
referral_1.default.hasMany(patientTestTable_1.default, { foreignKey: "referralId", as: "tests" });
patientTestTable_1.default.belongsTo(referral_1.default, { foreignKey: "referralId", as: "referral" });
// PATIENT -> TEST VISIT
patient_1.default.hasMany(patientTestTable_1.default, { foreignKey: "patientId", as: "tests" });
patientTestTable_1.default.belongsTo(patient_1.default, { foreignKey: "patientId", as: "patient" });
// TEST VISIT -> SERVICES
patientTestTable_1.default.hasMany(service_1.default, { foreignKey: "testVisitId", as: "services" });
service_1.default.belongsTo(patientTestTable_1.default, { foreignKey: "testVisitId", as: "visit" });
//STAFF  ->   RESULT
staffs_1.default.hasMany(testResult_1.default, { foreignKey: "staffId", as: "testResult" });
testResult_1.default.belongsTo(staffs_1.default, { foreignKey: "staffId,", as: "staff" });
// SERVICE -> RESULT 
service_1.default.hasMany(testResult_1.default, { foreignKey: "serviceId", as: "testResult" });
testResult_1.default.belongsTo(service_1.default, { foreignKey: "serviceId", as: "service" });
// PARAMETER TEMPLATE -> RESULT
testParameterTemplate_1.default.hasMany(testResult_1.default, { foreignKey: "parameterId", as: "results" });
testResult_1.default.belongsTo(testParameterTemplate_1.default, { foreignKey: "parameterId", as: "parameter" });
// SERVICE TEMPLATE -> PARAMETER TEMPLATE
serviceTemplate_1.default.hasMany(testParameterTemplate_1.default, {
    foreignKey: "serviceTemplateId",
    as: "testParameters",
});
testParameterTemplate_1.default.belongsTo(serviceTemplate_1.default, {
    foreignKey: "serviceTemplateId",
    as: "testService",
});
// SERVICE TEMPLATE → SERVICE INSTANCE (FIXED)
serviceTemplate_1.default.hasMany(service_1.default, {
    foreignKey: "serviceTemplateId", // ✅ Corrected from testServiceId
    as: "serviceInstances",
});
service_1.default.belongsTo(serviceTemplate_1.default, {
    foreignKey: "serviceTemplateId", // ✅ Corrected from testServiceId
    as: "template",
});
