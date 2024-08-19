import express from "express";
import { mailRouter } from "./routes/mailRouter";
import { initialLog } from "./utils/serverLog";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
export const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', mailRouter);

app.listen(port, initialLog);