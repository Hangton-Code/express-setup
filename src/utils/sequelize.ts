import { Dialect, Sequelize } from "sequelize";

const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME as string;
const DB_DATABASE_USER = process.env.DB_DATABASE_USER as string;
const DB_DATABASE_PASSWORD = process.env.DB_DATABASE_PASSWORD as string;
const DB_DIALECT = process.env.DB_DIALECT as Dialect;
const DB_HOST = process.env.DB_HOST as string;

const sequelize = new Sequelize(
  DB_DATABASE_NAME,
  DB_DATABASE_USER,
  DB_DATABASE_PASSWORD,
  {
    dialect: DB_DIALECT,
    host: DB_HOST,
  }
);

export default sequelize;
