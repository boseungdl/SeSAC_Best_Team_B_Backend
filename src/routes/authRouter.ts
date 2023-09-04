import express, { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import "../config/passportConfig"



const router: Router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));
// import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../models/tables/user";
import axios from 'axios';

// [5단계] 카카오 OAuth2.0 전략을 설정합니다.




router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    session: false,
    failureRedirect: "/login",
  }), async (req, res) => {
    console.log("authRouter")
    if (!req.user) {
      return res.status(401).send('User not authenticated');
    }
    console.log('req.user3', req.user)

    
    const accessToken = jwt.sign({ userId: req.user }, process.env.ACCESS_TOKEN_SECRET as any, { expiresIn: '1m' });
    const refreshToken = jwt.sign({ userId: req.user  }, process.env.REFRESH_TOKEN_SECRET as any, { expiresIn: '7d' });
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10일
    });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 1000 // 10분
    });

    res.redirect('http://localhost:3000');
  }
);



export default router;
