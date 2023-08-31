import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../models/tables/user";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id); // findByPk 메서드는 주어진 Primary Key로 DB에서 해당 데이터를 검색합니다.
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new KakaoStrategy(
    {
      clientID: "YOUR_KAKAO_APP_ID",
      callbackURL: "http://localhost:3000/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const {
        id,
        username: name,
        _json: {
          properties: { email },
        },
      } = profile;

      try {
        // 사용자 DB에 저장하거나 조회하는 로직
        let user = await User.findOne({ where: { id } });
        if (!user) {
          user = await User.create({
            id,
            username: name,
            // 이메일이 모델에 없기 때문에 이 부분은 주석 처리합니다.
            // 필요하다면 User 모델에 이메일 칼럼을 추가하십시오.
            // email,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
