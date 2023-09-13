import express from "express"; // Express 프레임워크를 사용하기 위해 가져옵니다.
import * as getdataController from "../controllers/getdataController"; // userController 내의 함수들을 가져옵니다.
import { verifyToken } from "../middlewares/verifyToken";
const router = express.Router(); // Express 라우터 인스턴스 생성

router.get("/room", verifyToken, getdataController.getUserAndRoomData);
router.get("/:roomId", verifyToken, getdataController.getImageRecord);

export default router;
