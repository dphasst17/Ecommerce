import express from "express";
import ProductController from "controllers/product";
import { verifyTokenAdmin } from "middlewares/middle";
const router = express.Router();
const productController = new ProductController()
router.get('/', productController.getAll)
router.get('/types', productController.getAllType)
router.get('/search/:key', productController.search)
router.get('/type/:nameType', productController.getProductByType)
router.get('/detail/type/:type', productController.getDetailType)
router.get('/col/:nameType', productController.getColByType)
router.post('/detail/:idProduct', productController.getDetail)
router.get('/new', productController.getNew)
router.get('/view', productController.getView)
router.get('/sale/all', productController.getAllSaleEvent)
router.get('/sale/', productController.getSale)
router.get('/sale/product', productController.eventProductGetAll)
router.get('/sale/detail/:idSale', productController.getSaleDetail)
router.post('/', verifyTokenAdmin, productController.insertProduct)
router.post('/type', verifyTokenAdmin, productController.insertCategory)
router.post('/image', verifyTokenAdmin, productController.insertImages)
router.patch('/image', verifyTokenAdmin, productController.updateImage)
router.patch('/', verifyTokenAdmin, productController.updateProduct)
router.post('/sale', verifyTokenAdmin, productController.insertSaleEvent)
router.patch('/sale', verifyTokenAdmin, productController.updateSaleEvent)
router.delete('/sale', verifyTokenAdmin, productController.deleteSaleEvent)
router.delete('/type/col', verifyTokenAdmin, productController.deleteColCategory)
router.delete('/type', verifyTokenAdmin, productController.removeCategory)
export default router