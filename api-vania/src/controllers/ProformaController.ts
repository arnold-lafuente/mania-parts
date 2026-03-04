import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import { AppDataSource } from "../data-source"
import { Proforma } from "../entity/Proforma"
import { ProformaItem } from "../entity/ProformaItem"
import { Product } from "../entity/Product"

export class ProformaController {

    static listAll = async (req: AuthRequest, res: Response) => {
        const proformaRepository = AppDataSource.getRepository(Proforma);
        const proformas = await proformaRepository.find({
            relations: ["client", "items", "items.product"],
            order: { createdAt: "DESC" }
        });
        res.send(proformas);
    };

    static getOne = async (req: AuthRequest, res: Response) => {
        const id = parseInt(req.params.id);
        const proformaRepository = AppDataSource.getRepository(Proforma);
        try {
            const proforma = await proformaRepository.findOneOrFail({
                where: { id },
                relations: ["client", "items", "items.product"]
            });
            res.send(proforma);
        } catch (error) {
            res.status(404).send("Proforma not found");
        }
    };

    static newProforma = async (req: AuthRequest, res: Response) => {
        const { clientId, items, discount = 0 } = req.body;

        if (!clientId) {
            res.status(400).json({ message: "clientId es obligatorio" });
            return;
        }
        if (!items || items.length === 0) {
            res.status(400).json({ message: "Debe agregar al menos un producto" });
            return;
        }

        const productRepo = AppDataSource.getRepository(Product);
        const proformaItems: ProformaItem[] = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await productRepo.findOne({ where: { id: item.productId } });
            if (!product) {
                res.status(400).json({ message: `Producto ${item.productId} no encontrado` });
                return;
            }
            const qty = parseInt(String(item.quantity), 10);
            const price = Number(item.price) || Number(product.price) || 0;
            const itemSubtotal = qty * price;

            const proformaItem = new ProformaItem();
            proformaItem.productId = item.productId;
            proformaItem.quantity = qty;
            proformaItem.price = price;
            proformaItem.subtotal = itemSubtotal;
            proformaItems.push(proformaItem);
            subtotal += itemSubtotal;
        }

        const discountAmount = Number(discount) || 0;
        const total = Math.max(0, subtotal - discountAmount);

        const proforma = new Proforma();
        proforma.clientId = clientId;
        proforma.subtotal = subtotal;
        proforma.discount = discountAmount;
        proforma.total = total;
        proforma.status = "pendiente";
        proforma.items = proformaItems;
        proformaItems.forEach((pi) => (pi.proforma = proforma));

        const proformaRepository = AppDataSource.getRepository(Proforma);
        try {
            const saved = await proformaRepository.save(proforma);
            res.status(201).json({ id: saved.id, message: "Proforma creada correctamente" });
        } catch (e) {
            console.error("Error creating proforma:", e);
            res.status(500).json({ message: "Error al crear la proforma" });
        }
    };

    static updateStatus = async (req: AuthRequest, res: Response) => {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        const validStatuses = ["pendiente", "vendido", "cancelado"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ message: "Estado inválido. Use: pendiente, vendido o cancelado" });
            return;
        }

        const username = req.username || "sistema";

        const proformaRepo = AppDataSource.getRepository(Proforma);
        const productRepo = AppDataSource.getRepository(Product);

        let proforma;
        try {
            proforma = await proformaRepo.findOneOrFail({
                where: { id },
                relations: ["items", "items.product"]
            });
        } catch {
            res.status(404).json({ message: "Proforma no encontrada" });
            return;
        }

        const previousStatus = proforma.status;

        if (previousStatus === "vendido" || previousStatus === "cancelado") {
            res.status(400).json({
                message: `No se puede cambiar el estado desde "${previousStatus}". Solo se puede cambiar desde pendiente.`
            });
            return;
        }

        if (status !== "vendido" && status !== "cancelado") {
            res.status(400).json({
                message: "Solo se puede cambiar a vendido o cancelado."
            });
            return;
        }

        proforma.status = status;
        proforma.statusChangedBy = username;

        if (status === "vendido") {
            for (const item of proforma.items) {
                const product = await productRepo.findOneOrFail({ where: { id: item.productId } });
                const currentStock = product.stock || 0;
                const newStock = currentStock - item.quantity;
                if (newStock < 0) {
                    res.status(400).json({
                        message: `Stock insuficiente para "${product.name}". Disponible: ${currentStock}, solicitado: ${item.quantity}`
                    });
                    return;
                }
                product.stock = newStock;
                await productRepo.save(product);
            }
        }

        await proformaRepo.save(proforma);
        res.json({ id: proforma.id, status: proforma.status, statusChangedBy: proforma.statusChangedBy });
    };

    static deleteProforma = async (req: AuthRequest, res: Response) => {
        const id = parseInt(req.params.id);
        const proformaRepository = AppDataSource.getRepository(Proforma);
        let proforma;
        try {
            proforma = await proformaRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("Proforma not found");
            return;
        }
        await proformaRepository.remove(proforma);
        res.status(204).send();
    };
}
