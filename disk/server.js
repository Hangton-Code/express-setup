"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const sequelize_1 = __importDefault(require("./utils/sequelize"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const errorHandler_1 = require("./helpers/errorHandler");
const cors_1 = __importDefault(require("cors"));
// database
sequelize_1.default.sync().then(() => {
    console.log("\n Database is ready \n");
});
// express config
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use(errorHandler_1.errorHandler);
// express listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`\n Server is running on port ${PORT} \n`);
});
