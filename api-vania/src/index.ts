import "reflect-metadata"
import express from "express"
import * as bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import * as dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import { requestLogger } from "./middleware/requestLogger"
import authRoutes from "./routes/auth.routes"
import clientRoutes from "./routes/client.routes"
import productRoutes from "./routes/product.routes"
import proformaRoutes from "./routes/proforma.routes"
import healthRoutes from "./routes/health.routes"
import batchRoutes from "./routes/batch.routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    hsts: false
}))
app.use(bodyParser.json())
app.use(requestLogger)

app.use("/auth", authRoutes)
app.use("/clients", clientRoutes)
app.use("/products", productRoutes)
app.use("/proformas", proformaRoutes)
app.use("/health", healthRoutes)
app.use("/batches", batchRoutes)

import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

AppDataSource.initialize().then(async () => {
    console.log("Database connected")

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })

}).catch(error => console.log(error))

export default app
