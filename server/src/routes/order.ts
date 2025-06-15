import express from "express";
import OrderController from "controllers/order";
import { verifyToken, verifyTokenAdmin } from "middlewares/middle";
const router = express.Router();
const orderController = new OrderController()
router.get('/', verifyTokenAdmin, orderController.getAll)
router.get('/shipper', verifyTokenAdmin, orderController.getOrderByRoleShipper)
router.get('/detail/:id', verifyTokenAdmin, orderController.getDetail)
router.get('/user', verifyToken, orderController.getByUser)
router.get('/purchase', verifyToken, orderController.getPurchaseOrderByUser)
router.post('/', verifyToken, orderController.insertOrder)
router.post('/admin', verifyTokenAdmin, orderController.adminInsertOrder)
router.patch('/', orderController.updateOrder)
router.delete('/', orderController.deleteOrderItem)

export default router