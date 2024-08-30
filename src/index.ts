import express, { Express } from "express";
import "express-async-errors";
import { mailRouter } from "./routes/mailRouter";
import { adonaRouter } from "./routes/ADONA/adonaRouter";
import * as dotenv from "dotenv";
import { handleError } from "./middlewares/handleError";
import { initialLog } from "./utils/serverLog";
import { initializeDatabase } from "./db/data-source";
dotenv.config();

export const port = process.env.PORT || 3000;

async function startServer(): Promise<Express> {
	 initializeDatabase(); 

	const app: Express = express(); 
	app.use(express.json());

	app.use("/api", mailRouter);
	app.use("/api/adona", adonaRouter);
	app.use(handleError);

	// app.listen(port, initialLog); 
	return app;
}

const appInstance = startServer().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1); 
});

export default appInstance; 
