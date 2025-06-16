import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from "sequelize";
import sequelize from "../connectDb";
import {Service} from "../models/association"

interface Result {
  propertyValue: string;
  refValue: string;
  actualValue?: string;
}

interface ServiceInterface {
  serviceId: number;
  serviceName: string;
  price: number;
  result: Result[];
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
  declare services: CreationOptional<ServiceInterface[]>;
  declare amountPaid: CreationOptional<number>;
  declare supposedAmountPaid: CreationOptional<number>;

  public  async addService(
    serviceId: number
  ) {

   const _service = await Service.findOne({
      where : {
         id : serviceId
      }
   })

   if(!_service) {
      return {
         errorCode : 404, 
         msg : `no service with id ${serviceId} found`
      }
   }

    const service: ServiceInterface = {
      serviceId : _service.id,
      serviceName : _service.name,
      price : _service.price,
      result : _service.properties
    };

    if (!this.services) {
      this.services = [];
    }

    (this.services as ServiceInterface[]).push(service);
    await this.save()
  }

 public async removeService(serviceId: number) {
  if (!this.services || !(this.services as ServiceInterface[]).length) {
    return {
      errorCode: 400,
      msg: "No services found for this user."
    };
  }

  const serviceIndex = (this.services as ServiceInterface[]).findIndex(
    (s) => s.serviceId === serviceId
  );

  if (serviceIndex === -1) {
    return {
      errorCode: 404,
      msg: `Service with ID ${serviceId} not found.`
    };
  }


  (this.services as ServiceInterface[]).splice(serviceIndex, 1);

  
  await this.save();

  return {
    success: true,
    msg: `Service with ID ${serviceId} removed successfully.`
  };
}


  public async setResult(
    serviceId: number,
    propertyValue: string,
    actualValue: string
  ) {
    const service = (this.services as ServiceInterface[]).find(
      (s) => s.serviceId === serviceId
    );

    if (!service) {
      return {
        errorCode: 404,
        msg: `No service with serviceId ${serviceId} found`
      };
    }

    const result = service.result.find(
      (r) => r.propertyValue === propertyValue
    );

    if (!result) {
      return {
        errorCode: 404,
        msg: `No property "${propertyValue}" in service "${service.serviceName}"`
      };
    }

    result.actualValue = actualValue;
    await this.save()
    return { success: true };
  }
}

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
