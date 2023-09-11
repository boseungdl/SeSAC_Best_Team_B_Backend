import express from "express";
import * as UploadController from "../controllers/uploadController";
import * as setRoomController from "../controllers/setRoomController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, UploadController.uploadImages);
router.post("/room", verifyToken, setRoomController.createRoom);

export default router;
