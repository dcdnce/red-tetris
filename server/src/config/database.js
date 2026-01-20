import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "../services/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "../../..", process.env.DB_PATH || "tetris.db"),
    synchronize: true, // Crée automatiquement les tables (dev seulement!)
    logging: process.env.DEBUG === "true",
    entities: [
        path.join(__dirname, "../entities/*.js")
    ],
});

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        Logger.success("✅ Database initialized successfully");
        return AppDataSource;
    } catch (error) {
        Logger.error("Error initializing database:", error);
        throw error;
    }
}
