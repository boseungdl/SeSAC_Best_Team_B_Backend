import express from 'express';   // Express 프레임워크를 사용하기 위해 가져옵니다.
import * as userController from '../controllers/userController';  // userController 내의 함수들을 가져옵니다.

const router = express.Router();  // Express 라우터 인스턴스 생성

router.get('/', userController.getAllUsers);   // 모든 사용자 정보를 가져오는 요청을 처리

export default router;