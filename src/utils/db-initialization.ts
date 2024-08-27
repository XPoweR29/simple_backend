import { AppDataSource } from "../db/data-source";

export const initializeDatabase = async (): Promise<void> => {
	try {
		await AppDataSource.initialize();
		console.log("Data Source has been initialized 💾 ➡ ✅");
	} catch (err) {
		console.log("Error occurred during Data Source initialization ❌", err);
	}
};
