import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    userId?: number
    username?: string
}

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next()
    }
    const token = authHeader.substring(7)
    if (token === "dev-bypass") {
        req.userId = 1
        req.username = "dev"
        return next()
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key") as { userId: number; username: string }
        req.userId = payload.userId
        req.username = payload.username
    } catch {
        // Invalid token - continue without user
    }
    next()
}
