import { Router } from "express";
import multer from "multer";
import { uploadToImageKit } from "../controllers/upload.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/imagekit", upload.single("file"), uploadToImageKit);

export default router;