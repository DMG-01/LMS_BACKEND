"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = __importDefault(require("../connectDb"));
const association_1 = require("./association");
class serviceTemplate extends sequelize_1.Model {
    // declare serviceTemplateId : number
    async changePrice(newPrice) {
        this.price = newPrice;
        await this.save();
        return {
            status: 1
        };
    }
    async addNewProperty(propertyName, propertyUnit, referenceValue) {
        const isPropertyAvailable = await association_1.TestParameterTemplate.findOne({
            where: {
                serviceTemplateId: this.id,
                name: propertyName,
                unit: propertyUnit,
                referenceValue: referenceValue
            }
        });
        if (isPropertyAvailable) {
            return {
                status: 0,
                msg: "property already exist"
            };
        }
        const newProperty = await association_1.TestParameterTemplate.create({
            name: propertyName,
            unit: propertyUnit,
            referenceValue: referenceValue,
            serviceTemplateId: this.id
        });
        if (newProperty) {
            return {
                status: 1,
                newProperty
            };
        }
    }
    async removeProperty(propertyId) {
        const propertyToRemove = await association_1.TestParameterTemplate.findOne({
            where: {
                id: propertyId,
                serviceTemplateId: this.id
            }
        });
        if (propertyToRemove) {
            await propertyToRemove.destroy();
            return {
                success: 1,
                msg: "property has been removed",
                propertyToRemove
            };
        }
        else {
            return {
                successs: 0,
                msg: "property NOT FOUND "
            };
        }
    }
    async editProperty(properties, propertyId) {
        const property = await association_1.TestParameterTemplate.findOne({
            where: {
                id: propertyId,
                serviceTemplateId: this.id
            }
        });
        if (!property) {
            return {
                success: 0,
                msg: "No matching property found"
            };
        }
        Object.assign(property, properties);
        await property.save();
        return {
            success: 1,
            msg: "Property successfully updated"
        };
    }
    async getServiceDetail() {
        const details = await association_1.ServiceTemplate.findOne({
            where: {
                id: this.id,
                name: this.name,
                price: this.name,
                //serviceTemplateId : this.serviceTemplateId
            },
            include: [{
                    model: association_1.TestParameterTemplate,
                }]
        });
    }
}
serviceTemplate.init({
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
    }
}, {
    sequelize: connectDb_1.default,
    timestamps: true,
    modelName: "ServiceTemplates",
    tableName: "serviceTemplates",
});
exports.default = serviceTemplate;
