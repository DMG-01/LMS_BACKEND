"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
const association_1 = require("./association");
class Service extends sequelize_1.Model {
    async uploadResult(value, parameterTemplateId) {
        try {
            console.log(`checking for parameter template`);
            const _testParameterTemplate = await association_1.TestParameterTemplate.findOne({
                where: {
                    serviceTemplateId: this.serviceTemplateId,
                    id: parameterTemplateId,
                },
            });
            if (!_testParameterTemplate) {
                console.log(`parameter template not found`);
                return {
                    status: 0,
                    msg: `Parameter template with ID ${parameterTemplateId} not found for service template ${this.serviceTemplateId}`,
                };
            }
            console.log(`creating result`);
            const testResultExist = await association_1.TestResult.findOne({
                where: {
                    serviceId: this.id,
                    parameterId: _testParameterTemplate.id
                }
            });
            if (testResultExist) {
                return {
                    status: 0,
                    msg: `A result already exist for serviceof id ${this.id} and parameter template of id ${_testParameterTemplate.id}`
                };
            }
            const _testResult = await association_1.TestResult.create({
                serviceId: this.id,
                parameterId: _testParameterTemplate.id,
                value: value,
            });
            console.log(`result created`);
            return {
                success: 1,
                _testResult,
            };
        }
        catch (err) {
            console.error(`❌ Error in uploadResult():`, err);
            return {
                status: 0,
                msg: "An unexpected error occurred while uploading the result",
                error: err,
            };
        }
    }
}
Service.init({
    id: {
        primaryKey: true,
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    price: {
        allowNull: false,
        type: sequelize_1.DataTypes.FLOAT,
    },
    testVisitId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    serviceTemplateId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER, // ✅ Added to match controller logic
    },
}, {
    sequelize: connectDb_1.default,
    timestamps: true,
    modelName: "Service",
    tableName: "services",
});
exports.default = Service;
