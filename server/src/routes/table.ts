import express from "express"
import TableController from "controllers/table";

const router = express.Router()
const tableController = new TableController()

router.post('/',tableController.create)
router.put('/',tableController.update)
router.delete('/',tableController.delete)

export default router