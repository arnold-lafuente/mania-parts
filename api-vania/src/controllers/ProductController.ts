import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Product } from "../entity/Product"

export class ProductController {

    static listAll = async (req: Request, res: Response) => {
        console.log('=====>')
        const productRepository = AppDataSource.getRepository(Product);
        const products = await productRepository.find();
        res.send(products);
    };

    static getOne = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const productRepository = AppDataSource.getRepository(Product);
        try {
            const product = await productRepository.findOneOrFail({ where: { id } });
            res.send(product);
        } catch (error) {
            res.status(404).send("Product not found");
        }
    };

    static newProduct = async (req: Request, res: Response) => {
        const { name, code, unit, location, brand, price, cost, stock } = req.body;

        const product = new Product();
        product.name = name;
        product.code = code ?? null;
        product.unit = unit ?? null;
        product.location = location ?? null;
        product.brand = brand ?? null;
        product.price = price != null ? Number(price) : 0;
        product.cost = cost != null ? Number(cost) : null;
        product.stock = stock != null ? parseInt(String(stock), 10) : 0;

        const productRepository = AppDataSource.getRepository(Product);
        try {
            await productRepository.save(product);
        } catch (e) {
            console.log(e)
            res.status(409).send("Error creating product");
            return;
        }
        res.status(201).send("Product created");
    };

    static editProduct = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { name, code, unit, location, brand, price, cost, stock } = req.body;

        const productRepository = AppDataSource.getRepository(Product);
        let product;
        try {
            product = await productRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("Product not found");
            return;
        }

        product.name = name;
        product.code = code ?? product.code;
        product.unit = unit ?? product.unit;
        product.location = location ?? product.location;
        product.brand = brand ?? product.brand;
        if (price != null) product.price = Number(price);
        if (cost != null) product.cost = Number(cost);
        if (stock != null) product.stock = parseInt(String(stock), 10);

        try {
            await productRepository.save(product);
        } catch (e) {
            res.status(409).send("Error updating product");
            return;
        }

        res.status(204).send();
    };

    static deleteProduct = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const productRepository = AppDataSource.getRepository(Product);
        let product;
        try {
            product = await productRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("Product not found");
            return;
        }
        await productRepository.remove(product);
        res.status(204).send();
    };
}
