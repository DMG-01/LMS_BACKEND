"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
const association_1 = require("./association");
class PatientTest extends sequelize_1.Model {
    async getRegisterDetail() {
        try {
            const _register = await association_1.patientTestTable.findOne({
                where: {
                    id: this.id
                },
                include: [
                    {
                        model: association_1.Service,
                        as: "services",
                        include: [
                            {
                                model: association_1.TestResult,
                                as: "testResult",
                                include: [{
                                        model: association_1.TestParameterTemplate,
                                        as: "parameter"
                                    }]
                            }
                        ]
                    },
                    {
                        model: association_1.Patient,
                        as: "patient"
                    }
                ]
            });
            if (_register) {
                return {
                    status: 1,
                    register: _register
                };
            }
        }
        catch (error) {
            console.log(error);
            return {
                status: 0,
                error: error
            };
        }
    }
    async changeAmountPaid(newAmountPaid, methodOfPayment) {
        if (methodOfPayment === "cash") {
            this.amountPaidInCash = newAmountPaid;
        }
        if (methodOfPayment === "POS") {
            this.amountPaidWithPos = newAmountPaid;
        }
        if (methodOfPayment === "transfer") {
            this.amountPaidInTransfer = newAmountPaid;
        }
        await this.save();
        return {
            success: 1,
            msg: `amount has been changed to ${newAmountPaid}`
        };
    }
    async removeService(serviceId) {
        const serviceToRemove = await association_1.Service.findOne({
            where: {
                id: serviceId,
                testVisitId: this.id
            }
        });
        if (!serviceToRemove) {
            return {
                status: 0,
                msg: `no service of ${serviceId} EXIST in this register `
            };
        }
        await serviceToRemove.destroy();
        await this.save();
        return {
            status: 1,
            msg: ` service with id ${serviceId} successfully removed from register number ${this.id}`
        };
    }
    async addService(serviceId) {
        console.log(`adding service`);
        const isServiceIdValid = await association_1.ServiceTemplate.findOne({
            where: {
                id: serviceId
            }
        });
        if (!isServiceIdValid) {
            return {
                status: 0,
                msg: `${serviceId} is an invalid service id`
            };
        }
        const serviceExist = await association_1.Service.findOne({
            where: {
                testVisitId: this.id,
                serviceTemplateId: isServiceIdValid.id
            }
        });
        let serviceToAdd;
        if (!serviceExist) {
            serviceToAdd = await association_1.Service.create({
                name: isServiceIdValid.name,
                price: isServiceIdValid.price,
                testVisitId: this.id,
                serviceTemplateId: isServiceIdValid.id
            });
        }
        else {
            return {
                status: 0,
                msg: `serivice already exist`
            };
        }
        return {
            status: 1,
            msg: `service of id ${serviceId} added successfully `,
            serviceToAdd
        };
    }
    async toggleStatus() {
        this.status === "uncompleted" ? this.status = "completed" : this.status = "uncompleted";
        await this.save();
        return this.status;
    }
}
PatientTest.init({
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    patientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("completed", "uncompleted"),
        defaultValue: "uncompleted",
        allowNull: false
    },
    amountPaidInCash: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    amountPaidInTransfer: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    amountPaidWithPos: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    dateTaken: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    referralId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    sequelize: connectDb_1.default,
    modelName: "patientTestTable",
    tableName: "patientTestTable",
    timestamps: true
});
exports.default = PatientTest;
