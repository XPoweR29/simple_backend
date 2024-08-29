import express from "express";
import "express-async-errors";
import { mailRouter } from "./routes/mailRouter";
import { adonaRouter } from "./routes/ADONA/adonaRouter";
import * as dotenv from "dotenv";
import { handleError } from "./middlewares/handleError";
import { initializeDatabase } from "./utils/db-initialization";
import { initialLog } from "./utils/serverLog";
dotenv.config();

export const port = process.env.PORT || 3000;

initializeDatabase();
const app = express();

app.use(express.json());

app.use("/api", mailRouter);
app.use("/api/adona", adonaRouter);

app.use(handleError);

// app.listen(port, initialLog);

export default app;
