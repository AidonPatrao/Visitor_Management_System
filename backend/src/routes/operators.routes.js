import express from 'express';
import { 
  getOperators, 
  createOperator, 
  deactivateOperator, 
  activateOperator 
} from '../controllers/operators.controller.js';
import verifyToken from '../middleware/verifyToken.middleware.js'
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js'

const router = express.Router();

router.get('/operators',verifyToken,verifyAdmin, getOperators);
router.post('/operators', verifyToken,verifyAdmin,createOperator);
router.patch('/operators/:id/deactivate',verifyToken,verifyAdmin, deactivateOperator);
router.patch('/operators/:id/activate',verifyToken,verifyAdmin, activateOperator);

export default router;