"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
class testParameterTemplate extends sequelize_1.Model {
}
testParameterTemplate.init({
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    referenceValue: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: "none"
    },
    serviceTemplateId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "testparametertemplate",
    modelName: "testParameterTemplate",
    sequelize: connectDb_1.default
});
exports.default = testParameterTemplate;
