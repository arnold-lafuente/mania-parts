import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Client } from "../entity/Client"

export class ClientController {

    static listAll = async (req: Request, res: Response) => {
        const clientRepository = AppDataSource.getRepository(Client);
        const clients = await clientRepository.find();
        res.send(clients);
    };

    static getOne = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const clientRepository = AppDataSource.getRepository(Client);
        try {
            const client = await clientRepository.findOneOrFail({ where: { id } });
            res.send(client);
        } catch (error) {
            res.status(404).send("Client not found");
        }
    };

    static newClient = async (req: Request, res: Response) => {
        const { name, nit, email, phone, address } = req.body;
        const client = new Client();
        client.name = name;
        client.nit = nit;
        client.email = email;
        client.phone = phone;
        client.address = address;

        const clientRepository = AppDataSource.getRepository(Client);
        try {
            await clientRepository.save(client);
        } catch (e) {
            res.status(409).send("Email already in use");
            return;
        }

        res.status(201).send("Client created");
    };

    static editClient = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { name, nit, email, phone, address } = req.body;

        const clientRepository = AppDataSource.getRepository(Client);
        let client;
        try {
            client = await clientRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("Client not found");
            return;
        }

        client.name = name;
        client.nit = nit;
        client.email = email;
        client.phone = phone;
        client.address = address;

        try {
            await clientRepository.save(client);
        } catch (e) {
            res.status(409).send("Email already in use");
            return;
        }

        res.status(204).send();
    };

    static deleteClient = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const clientRepository = AppDataSource.getRepository(Client);
        let client;
        try {
            client = await clientRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("Client not found");
            return;
        }
        await clientRepository.remove(client);
        res.status(204).send();
    };
}
