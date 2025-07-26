"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
class TestResult extends sequelize_1.Model {
}
TestResult.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    serviceId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    parameterId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: connectDb_1.default,
    modelName: "testResult",
    tableName: "testResult",
    timestamps: true
});
////register number --> service -->result ---> parameter 
// add constraint, there cannot be 2 parameters in the same service
exports.default = TestResult;
