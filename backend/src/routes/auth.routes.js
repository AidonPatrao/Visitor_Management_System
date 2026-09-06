import express from "express";
import authController from '../controllers/auth.controller.js'


const router = express.Router()

router.post('/admin',authController.adminLogin)
router.post('/operator',authController.operatorLogin)
router.post('/logout',authController.logout)


export default router