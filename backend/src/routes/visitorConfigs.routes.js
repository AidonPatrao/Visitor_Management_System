import express from 'express';
import { 
  getVisitorConfigs, 
  createVehicleType, 
  deleteVehicleType, 
  createMemberCount, 
  deleteMemberCount 
} from '../controllers/visitorConfigs.controller.js';
import verifyToken from '../middleware/verifyToken.middleware.js'
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js'

const router = express.Router();

router.get('/visitorConfigs',verifyToken,verifyAdmin, getVisitorConfigs);


router.post('/visitorConfigs/vehicleTypes',verifyToken,verifyAdmin, createVehicleType);
router.delete('/visitorConfigs/vehicleTypes/:id',verifyToken,verifyAdmin, deleteVehicleType);


router.post('/visitorConfigs/memberCounts',verifyToken,verifyAdmin, createMemberCount);
router.delete('/visitorConfigs/memberCounts/:id',verifyToken,verifyAdmin, deleteMemberCount);

export default router;