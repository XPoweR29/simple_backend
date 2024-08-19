import express from "express";
import { mailRouter } from "./routes/mailRouter";
import { initialLog } from "./utils/serverLog";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", mailRouter);

// Zamiast app.listen(), musisz wyeksportować swoją aplikację express
export default app;
