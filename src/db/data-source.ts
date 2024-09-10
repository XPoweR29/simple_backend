import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();


let dataSource: DataSource | null = null;

export const initializeDatabase = async (): Promise<DataSource> => {
	if (dataSource && dataSource.isInitialized) {
		console.log("Data Source is already initialized 💾 ➡ ✅");
		return dataSource;
	}
	try {
		dataSource = new DataSource({
			type: "mysql",
			host: process.env.ADONA_DB_HOSTNAME,
			port: 3306,
			username: process.env.ADONA_DB_USER,
			password: process.env.ADONA_DB_PASS,
			database: process.env.ADONA_DB_DATABASE,
			synchronize: false,
			logging: false,
			entities: ["src/entities/*.js"],
			migrations: [],
			subscribers: [],
		});

		await dataSource.initialize();
		console.log("Data Source has been initialized successfully 💾 ➡ ✅");

		return dataSource;
	} catch (err) {
		console.error("Error during Data Source initialization ❌");
		throw new Error(err);
	}
};
