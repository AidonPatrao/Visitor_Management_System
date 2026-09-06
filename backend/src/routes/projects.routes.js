import express from 'express';
import {
    getProjects,
    createProject,
    updateProject,
    deactivateProject,
    activateProject
} from '../controllers/projects.controller.js';
import verifyToken from '../middleware/verifyToken.middleware.js'
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js'

const router = express.Router();

router.get('/projects',verifyToken,verifyAdmin, getProjects);
router.post('/projects',verifyToken,verifyAdmin, createProject);
router.patch('/projects/:id',verifyToken,verifyAdmin, updateProject); // PATCH for editing the name
router.patch('/projects/:id/deactivate',verifyToken,verifyAdmin, deactivateProject);
router.patch('/projects/:id/activate',verifyToken,verifyAdmin, activateProject);

export default router;