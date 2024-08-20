import express from "express";
import { mailRouter } from "./routes/mailRouter";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "https://webcraft-studio.pl");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

app.use(express.json());

app.use("/api", mailRouter);

export default app;
