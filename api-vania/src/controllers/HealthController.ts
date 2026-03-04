import { Request, Response } from "express"

export class HealthController {
    static check = async (req: Request, res: Response) => {
        res.status(200).send({ status: "OK", timestamp: new Date() });
    };
}
