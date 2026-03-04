import { Response } from "express"
import { AppDataSource } from "../data-source"
import { Product } from "../entity/Product"
import { InvoiceEntry } from "../entity/InvoiceEntry"
import { AuthRequest } from "../middleware/auth"

interface BatchItem {
    productId: number
    cost: number
    price: number
    quantity: number
    invoiceNumber: string
    provider: string
}

export class BatchController {
    static registerBatch = async (req: AuthRequest, res: Response): Promise<void> => {
        const items = req.body as BatchItem[]
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "Se requiere al menos un item" })
            return
        }

        const username = req.username || "sistema"
        const productRepo = AppDataSource.getRepository(Product)
        const invoiceRepo = AppDataSource.getRepository(InvoiceEntry)

        try {
            for (const item of items) {
                const { productId, cost, price, quantity, invoiceNumber, provider } = item
                if (!productId || !invoiceNumber?.trim() || !provider?.trim()) {
                    res.status(400).json({ message: "productId, invoiceNumber y provider son obligatorios" })
                    return
                }

                const product = await productRepo.findOne({ where: { id: productId } })
                if (!product) {
                    res.status(404).json({ message: `Producto ${productId} no encontrado` })
                    return
                }

                const total = Number(cost) * Number(quantity)
                const salePrice = Number(price)
                const qty = parseInt(String(quantity), 10)
                const currentPrice = product.price != null ? Number(product.price) : 0

                product.cost = Number(cost)
                product.stock = (product.stock || 0) + qty

                if (salePrice > currentPrice) {
                    product.previousPrice = currentPrice > 0 ? currentPrice : null
                    product.price = salePrice
                    product.lastModifiedBy = username
                }

                await productRepo.save(product)

                const entry = new InvoiceEntry()
                entry.invoiceNumber = String(invoiceNumber).trim()
                entry.provider = String(provider).trim()
                entry.productId = productId
                entry.cost = Number(cost)
                entry.salePrice = salePrice
                entry.quantity = qty
                entry.total = total
                entry.registeredBy = username
                await invoiceRepo.save(entry)
            }

            res.status(201).json({ message: "Registro de factura guardado correctamente" })
        } catch (error) {
            console.error("Error registering batch:", error)
            res.status(500).json({ message: "Error al registrar la factura" })
        }
    }

    static getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
        console.log("[batches/history] request received")
        const invoiceRepo = AppDataSource.getRepository(InvoiceEntry)
        try {
            const entries = await invoiceRepo.find({
                relations: ["product"],
                order: { createdAt: "DESC" },
                take: 500,
            })
            console.log("[batches/history] found", entries.length, "entries")
            const payload = entries.map((e) => ({
                id: e.id,
                invoiceNumber: e.invoiceNumber,
                provider: e.provider,
                productId: e.productId,
                cost: Number(e.cost),
                salePrice: Number(e.salePrice),
                quantity: e.quantity,
                total: Number(e.total),
                registeredBy: e.registeredBy,
                createdAt: e.createdAt,
                product: e.product ? { id: e.product.id, name: e.product.name, code: e.product.code } : null,
            }))
            res.json(payload)
        } catch (error) {
            console.error("[batches/history] Error fetching invoice history:", error)
            res.status(500).json({ message: "Error al obtener el historial_____asdas" })
        }
    }
}
