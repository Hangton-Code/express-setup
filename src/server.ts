import express from "express";
require("dotenv").config();
import sequelize from "./utils/sequelize";
import authRouter from "./routes/authRoute";
import { errorHandler } from "./helpers/errorHandler";

// database
sequelize.sync().then(() => {
  console.log("\n Database is ready \n");
});

// express config
const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use(errorHandler);

// express listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`\n Server is running on port ${PORT} \n`);
});
