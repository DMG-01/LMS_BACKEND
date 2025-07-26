"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
class Referral extends sequelize_1.Model {
    async payDiscount(amountToPay) {
        this.totalDiscountPayed += amountToPay;
        return {
            success: 1,
            msg: `${amountToPay} successfully paid`
        };
    }
}
Referral.init({
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    totalAllocatedDiscount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    totalDiscountPayed: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    accountNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    referralId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: connectDb_1.default,
    timestamps: true,
    tableName: "referral",
    modelName: "referral",
});
exports.default = Referral;
