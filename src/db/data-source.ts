import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "srv861.hstgr.io",
	port: 3306,
	username: "u646570781_admin_adona",
    // FIXME: pwd must be keep in env!
	password: "Q&TjaKZIgy8",
	database: "u646570781_ADONA_menu",
	synchronize: false,
	logging: true,
	entities: ["src/entities/*.ts"],
	migrations: [],
	subscribers: [],
});
