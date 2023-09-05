import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// interface UserPayload {
//   id: string;
//   email: string;
//   // 여기에 필요한 다른 필드를 추가할 수 있습니다.
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: UserPayload;
//     }
//   }
// }

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return res.status(403).send('Access and refresh tokens are required for authentication');
  }

  if (accessToken) {
    try {
      interface MyJwtPayload extends JwtPayload {
        userId: string;
      }
      
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as MyJwtPayload;
      req.user = decoded.userId;
      console.log('decodedRefreshToken', req.user)
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // 엑세스 토큰이 만료된 경우 리프레시 토큰을 사용하여 새 엑세스 토큰을 생성
        if (refreshToken) {
          try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
            
            // 새 액세스 토큰 생성
            const newAccessToken = jwt.sign({ userId: decodedRefreshToken.userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
            
            // 쿠키에 새 액세스 토큰 저장
            res.cookie('accessToken', newAccessToken, { httpOnly: true });
            
            req.user = decodedRefreshToken;
          } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
              // 리프레시 토큰이 만료되었을 때 카카오 로그인 페이지로 리다이렉트
              return res.redirect('http://localhost:3000/login');
            }
            return res.status(401).send('Invalid refresh token');
          }
        } else {
          return res.status(403).send('Refresh token is required for generating a new access token');
        }
      } else {
        return res.status(401).send('Invalid access token');
      }
    }
  } else if (refreshToken) {
    // 엑세스 토큰이 없고 리프레시 토큰만 있는 경우
    try {
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
      
      // 새 액세스 토큰 생성
      const newAccessToken = jwt.sign({ userId: decodedRefreshToken.userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
      
      // 쿠키에 새 액세스 토큰 저장
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      
      req.user = decodedRefreshToken.userId;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // 리프레시 토큰이 만료되었을 때 카카오 로그인 페이지로 리다이렉트
        return res.redirect('http://localhost:3000/login');
      }
      return res.status(401).send('Invalid refresh token');
    }
  }

  return next();
};
