import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../models/tables/user";

// [5단계] 카카오 OAuth2.0 전략을 설정합니다.
passport.use(
  new KakaoStrategy(
    {
      clientID: "7d6513c572864c8e45cf0148a71c7227",
      callbackURL: process.env.BACKEND_URL + "/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 사용자를 데이터베이스에서 찾거나 새로운 사용자를 생성
        console.log("패스포트카카오전략 시작")
        let user = await User.findOne({ where: { kakaoId: profile.username } });

        if (!user) {
          user = await User.create({
            kakaoId: profile.username,
            refreshToken: refreshToken,
          });
        } else {
          // 토큰 정보 업데이트
          user.refreshToken = refreshToken;
          await user.save();
        }
        // done 함수를 호출하여 req.user를 설정
        done(null, user.kakaoId);
      } catch (error) {
        done("error", error);
      }
    }
  )
);
