import express from "express";
import "express-async-errors";
import { mailRouter } from "./routes/mailRouter";
import * as dotenv from "dotenv";
import { handleError } from "./middlewares/handleError";
dotenv.config();

export const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/api", mailRouter);

app.use(handleError);

export default app;
