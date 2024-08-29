import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();


export const AppDataSource = new DataSource({
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
