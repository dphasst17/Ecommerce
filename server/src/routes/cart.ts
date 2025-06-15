import express from "express";
import CartController from "controllers/cart";
import { verifyToken } from "middlewares/middle";
const router = express.Router();
const cartController = new CartController()
router.post('/',verifyToken,cartController.cartInsert)
router.patch('/',cartController.cartUpdateCount)
router.delete('/',cartController.cartRemove)

export default router