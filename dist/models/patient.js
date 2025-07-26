"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
class patient extends sequelize_1.Model {
}
patient.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    dateOfBirth: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, { sequelize: connectDb_1.default,
    timestamps: true,
    modelName: 'patient',
    tableName: "patients"
});
exports.default = patient;
