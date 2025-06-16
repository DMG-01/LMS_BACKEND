import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from "sequelize";
import sequelize from "../connectDb";
import { Service } from "../models/association";


interface Result {
  propertyValue: string;
  refValue: string;
  actualValue?: string;
}

class Register extends Model<
  InferAttributes<Register>,
  InferCreationAttributes<Register>
> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare phoneNumber: string;
  declare email: CreationOptional<string>;
  declare services: CreationOptional<number[]>;
  declare results: CreationOptional<Result[]>;
  declare amountPaid: CreationOptional<number>;
  declare supposedAmountPaid: CreationOptional<number>;


  public async addService(serviceId: number) {
    const _service = await Service.findOne({ where: { id: serviceId } });

    if (!_service) {
      return {
        errorCode: 404,
        msg: `No service with id ${serviceId} found`
      };
    }

    if (!this.services) {
      this.services = [];
    }

    if (this.services.includes(serviceId)) {
      return {
        errorCode: 409,
        msg: `Service with ID ${serviceId} already exists for this user.`
      };
    }

    this.services.push(serviceId);
    await this.save();

    return {
      success: true,
      msg: `Service ID ${serviceId} added successfully.`
    };
  }

  // Remove service by ID
  public async removeService(serviceId: number) {
    if (!this.services || this.services.length === 0) {
      return {
        errorCode: 400,
        msg: "No services found for this user."
      };
    }

    const index = this.services.findIndex((s) => s === serviceId);
    if (index === -1) {
      return {
        errorCode: 404,
        msg: `Service with ID ${serviceId} not found.`
      };
    }

    this.services.splice(index, 1);
    await this.save();

    return {
      success: true,
      msg: `Service ID ${serviceId} removed successfully.`
    };
  }


  public async setResult(
    serviceId: number,
    propertyValue: string,
    actualValue: string
  ) {
    if (!this.results) {
      return {
        errorCode: 400,
        msg: "No results array found in register."
      };
    }

    const result = this.results.find(
      (r) => r.propertyValue === propertyValue
    );

    if (!result) {
      return {
        errorCode: 404,
        msg: `No property "${propertyValue}" found in results`
      };
    }

    result.actualValue = actualValue;
    await this.save();

    return { success: true, msg: `Result updated.` };
  }
}

// Sequelize model definition
Register.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    services: {
      type: DataTypes.JSON, 
      allowNull: false,
      defaultValue: []
    },
    results: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    amountPaid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supposedAmountPaid: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: "register",
    tableName: "register"
  }
);

export default Register;
