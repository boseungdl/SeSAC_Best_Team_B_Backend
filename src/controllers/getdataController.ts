import { Request, Response } from 'express';
import  Image  from '../models/tables/image'; // User 모델의 경로에 따라 조정
import  Record  from '../models/tables/record'; // User 모델의 경로에 따라 조정
import  User  from '../models/tables/user'; // User 모델의 경로에 따라 조정

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.user; // 라우터 설정에 따라 'id'를 조정할 수 있습니다.
    console.log('getdata req.user', userId)
    
    const userWithRecordsAndImages = await User.findOne({
      where: { kakaoId: userId },
      include: [
        {
          model: Record,
          include: [Image]
        }
      ]
    });
    console.log(userWithRecordsAndImages)


    

    res.json(userWithRecordsAndImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};