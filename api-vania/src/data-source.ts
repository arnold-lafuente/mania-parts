import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"

// Cargar .env y luego .env.local si existe (override para dev local)
dotenv.config()
const envLocalPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath, override: true })
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA || process.env.DB_USERNAME || "public",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
})
