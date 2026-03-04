import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import * as jwt from "jsonwebtoken"

export class AuthController {
    static signup = async (req: Request, res: Response) => {
        const { username, password, role } = req.body;

        if (!(username && password)) {
            return res.status(400).send({ message: "Username and password are required" });
        }

        const userRepository = AppDataSource.getRepository(User);

        // Verificar se usuario já existe
        const existingUser = await userRepository.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).send({ message: "User already exists" });
        }

        // Criar novo user
        const user = new User();
        user.username = username;
        user.password = password; // será hashado no entity (se você tiver @BeforeInsert)
        user.role = role || "user";

        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(500).send({ message: "Error creating user" });
        }

        return res.status(201).send({
            message: "User created successfully",
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    };

    static login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
            return;
        }

        const isDevBypass = process.env.NODE_ENV === "dev" || process.env.ENV === "dev";

        const userRepository = AppDataSource.getRepository(User);
        let user: User | null = null;
        try {
            user = await userRepository.findOne({ where: { username } });
        } catch (error) {
            // Ignore
        }

        // En modo dev: si no existe usuario, crear respuesta mock; si existe, omitir verificación de contraseña
        if (isDevBypass) {
            const devUser = user ?? { id: 1, username, role: "admin" };
            const token = jwt.sign(
                { userId: (devUser as User).id, username: (devUser as User).username, role: (devUser as User).role },
                process.env.JWT_SECRET || "your_jwt_secret_key",
                { expiresIn: "24h" }
            );
            res.send({
                token,
                user: { id: (devUser as User).id, username: (devUser as User).username, role: (devUser as User).role },
            });
            return;
        }

        if (!user) {
            return void res.status(401).send();
        }

        if (!(await user.checkPassword(password))) {
            return void res.status(401).send();
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || "your_jwt_secret_key",
            { expiresIn: "1h" }
        );

        res.send({ token, user: { id: user.id, username: user.username, role: user.role } });
        return;
    };

    static logout = async (req: Request, res: Response) => {
        // Stateless JWT, client should remove token.
        res.status(200).send({ message: "Logged out successfully" });
    };
}
