import express from 'express'
import { getDepartment,createDepartment , updateDepartment,deactivateDepartment,activateDepartment} from '../controllers/departments.controller.js'
import verifyToken from '../middleware/verifyToken.middleware.js'
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js'

const router = express.Router()

router.get('/departments',verifyToken,verifyAdmin,getDepartment)
router.post('/departments',verifyToken,verifyAdmin,createDepartment)
router.patch('/departments/:id',verifyToken,verifyAdmin,updateDepartment)
router.patch('/departments/:id/deactivate',verifyToken,verifyAdmin,deactivateDepartment)
router.patch('/departments/:id/activate',verifyToken,verifyAdmin,activateDepartment)

export default router