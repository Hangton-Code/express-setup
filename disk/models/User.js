"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../utils/sequelize"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    avatar_url: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: "default",
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    refreshTokens: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: [],
    },
}, {
    sequelize: sequelize_2.default,
    modelName: "users",
});
