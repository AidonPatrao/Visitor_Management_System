import express from 'express';
import { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deactivateEmployee, 
  activateEmployee 
} from '../controllers/employees.controller.js';
import verifyToken from '../middleware/verifyToken.middleware.js'
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js'

const router = express.Router();

router.get('/employees',verifyToken,verifyAdmin, getEmployees);


router.post('/employees', verifyToken,verifyAdmin,createEmployee);


router.patch('/employees/:id', verifyToken,verifyAdmin,updateEmployee);


router.patch('/employees/:id/deactivate',verifyToken,verifyAdmin, deactivateEmployee);


router.patch('/employees/:id/activate', verifyToken,verifyAdmin,activateEmployee);

export default router;