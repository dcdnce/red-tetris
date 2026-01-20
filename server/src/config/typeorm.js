import { DataSource } from "typeorm";

// Configuration pour les migrations CLI
export default new DataSource({
    type: "sqlite",
    database: process.env.DB_PATH || "tetris.db",
    synchronize: false,
    logging: true,
    entities: ["server/src/entities/*.js"],
    migrations: ["server/src/migrations/*.js"],
    migrationsTableName: "migrations_history",
});
