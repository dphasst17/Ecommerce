import express from "express";
import UserController from "controllers/user";
import { verifyRoleAdmin, verifyToken, verifyTokenAdmin } from "middlewares/middle";
const router = express.Router();
const userController = new UserController()

router.get('/', verifyToken, userController.getUser)
router.get('/admin', verifyToken, userController.adminGetInfo)
router.get('/admin/shipper', verifyTokenAdmin, userController.admingetShipper)
router.patch('/', verifyToken, userController.userUpdate)
router.post('/address', verifyToken, userController.userAddress)
router.patch('/status', verifyRoleAdmin, userController.changeStatus)
router.get('/address', userController.getAllAddress)
router.get('/u', userController.getAllUser)
router.get('/s', verifyTokenAdmin, userController.getAllStaff)

export default router