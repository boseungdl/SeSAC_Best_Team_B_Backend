import { Request, Response } from 'express'; 
import User from '../models/user';  // User 모델을 가져옵니다.

// 모든 사용자 정보를 반환하는 함수
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

