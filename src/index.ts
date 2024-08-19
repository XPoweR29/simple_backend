import express from "express";
import { mailRouter } from "./routes/mailRouter";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

app.use("/api", mailRouter);

// Zamiast app.listen(), musisz wyeksportować swoją aplikację express
export default app;
