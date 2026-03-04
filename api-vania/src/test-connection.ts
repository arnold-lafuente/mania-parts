import "reflect-metadata"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {
    console.log("Database connected successfully")

    const userRepository = AppDataSource.getRepository(User)
    const userCount = await userRepository.count()
    console.log(`Current user count: ${userCount}`)

    process.exit(0)
}).catch(error => {
    console.error("Error connecting to database:", error)
    process.exit(1)
})
