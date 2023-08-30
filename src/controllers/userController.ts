import { Request, Response } from 'express';
// User 모델을 가져옵니다. (User 모델이 정의되어 있어야 합니다.)
import  User  from '../models/tables/user';

/**
 * 모든 유저 정보를 가져오는 함수
 * @param req - Express의 Request 객체
 * @param res - Express의 Response 객체
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // 여기서는 sequelize를 사용하여 모든 사용자를 검색합니다.
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).send('서버 오류가 발생했습니다.');
    }
};