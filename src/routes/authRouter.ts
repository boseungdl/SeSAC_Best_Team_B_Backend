import express, { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import "../config/passportConfig"
const ACCESS_TOKEN_SECRET = 'YOUR_ACCESS_TOKEN_SECRET';
const REFRESH_TOKEN_SECRET = 'YOUR_REFRESH_TOKEN_SECRET';


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

    const accessToken = jwt.sign({ userId: req.user }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: req.user }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });



    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: accessToken });
  }
);



export default router;
