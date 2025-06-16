import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 100000,
      idle: 10000,
    },
  }
);

export default  sequelize;
