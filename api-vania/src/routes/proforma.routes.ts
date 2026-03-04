import { Router } from "express";
import { ProformaController } from "../controllers/ProformaController";
import { optionalAuth } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Proformas
 *   description: Sales Proforma management
 */

/**
 * @swagger
 * /proformas:
 *   get:
 *     summary: List all proformas
 *     tags: [Proformas]
 *     responses:
 *       200:
 *         description: List of proformas
 */
router.get("/", ProformaController.listAll);

/**
 * @swagger
 * /proformas/{id}:
 *   get:
 *     summary: Get a proforma by ID
 *     tags: [Proformas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proforma details
 *       404:
 *         description: Proforma not found
 */
router.get("/:id", ProformaController.getOne);

/**
 * @swagger
 * /proformas:
 *   post:
 *     summary: Create a new proforma
 *     tags: [Proformas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Proforma created
 *       400:
 *         description: Invalid input or product not found
 */
router.post("/", ProformaController.newProforma);

router.patch("/:id/status", optionalAuth, ProformaController.updateStatus);

/**
 * @swagger
 * /proformas/{id}:
 *   delete:
 *     summary: Delete a proforma
 *     tags: [Proformas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Proforma deleted
 *       404:
 *         description: Proforma not found
 */
router.delete("/:id", ProformaController.deleteProforma);

export default router;
