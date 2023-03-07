import express from "express";
require("dotenv").config();
import sequelize from "./utils/sequelize";
import authRoute from "./routes/authRoute";
import profileRoute from "./routes/profileRoute";
import { errorHandler } from "./helpers/errorHandler";
import cors from "cors";

// database
sequelize.sync().then(() => {
  console.log("\n Database is ready \n");
});

// express config
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use(errorHandler);

// express listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`\n Server is running on port ${PORT} \n`);
});
