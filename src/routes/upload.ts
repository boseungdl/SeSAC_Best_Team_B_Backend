import express from "express";
import * as UploadController from "../controllers/uploadController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, UploadController.uploadImages);

export default router;
