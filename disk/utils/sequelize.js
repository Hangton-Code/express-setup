"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
const DB_DATABASE_USER = process.env.DB_DATABASE_USER;
const DB_DATABASE_PASSWORD = process.env.DB_DATABASE_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_HOST = process.env.DB_HOST;
const sequelize = new sequelize_1.Sequelize(DB_DATABASE_NAME, DB_DATABASE_USER, DB_DATABASE_PASSWORD, {
    dialect: DB_DIALECT,
    host: DB_HOST,
});
exports.default = sequelize;
