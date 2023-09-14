import express, { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "../config/passportConfig";

const router: Router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../models/tables/user";
import axios from "axios";


router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    console.log("/kakao/callback라우터에 콜백함수 시작")
    if (!req.user) {
      return res.status(401).send("사용자를 찾을 수 없습니다.");
    }
    const accessToken = jwt.sign(
      { userId: req.user },
      process.env.ACCESS_TOKEN_SECRET as any,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { userId: req.user },
      process.env.REFRESH_TOKEN_SECRET as any,
      { expiresIn: "7d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10일
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: true,
      maxAge: 1 * 60 * 1000, // 10분
    });

    res.redirect(process.env.FRONTEND_URL as string);
  }
);

export default router;
