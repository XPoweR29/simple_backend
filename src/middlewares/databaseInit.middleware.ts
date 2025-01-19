import { NextFunction, Request, Response } from "express";
import { initializeDatabase } from "../db/data-source"; // Import funkcji initializeDatabase

export const databaseInit = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Upewnij się, że DataSource jest zainicjalizowany przed przetwarzaniem żądania
		await initializeDatabase();
		next(); // Kontynuuj przetwarzanie żądania
	} catch (error) {
		console.error("Failed to initialize Data Source:", error);
		res
			.status(500)
			.json({
				message: "Internal Server Error - Could not initialize database.",
			});
	}
};
