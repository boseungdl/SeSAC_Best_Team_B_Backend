import express from "express";
import * as UploadController from "../controllers/uploadController";

const router = express.Router();

router.post("/", UploadController.uploadImages);

export default router;
