import express, { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import userRoutes from "./routes/user";
import uploadRoutes from "./routes/upload";
import authRouter from "./routes/authRouter";
import sequelize from "./models/index";
import { RedisStore, redisClient } from "./config/redisConfig";
import './config/passportConfig';
import cookieParser from 'cookie-parser';
// [설명] express 애플리케이션을 초기화합니다.
const app: Express = express();

// [설명] JSON 형태의 요청 본문을 파싱하기 위해 express.json 미들웨어를 사용합니다.
app.use(express.json());

// [설명] CORS 관련 문제를 피하기 위해 모든 도메인에서의 요청을 허용합니다.
//실제 프로덕션 환경에서는 특정 도메인만 허용하도록 설정해야 합니다.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next(); // 다음 미들웨어로 진행합니다.
});


app.use(passport.initialize());


// [설명] 사용자 관련 라우트를 /users 경로에 연결합니다.
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/auth", authRouter);

//[설명] Sequelize를 사용하여 모델과 데이터베이스를 동기화합니다.
sequelize
  .sync({ alter: true }) // force: true 옵션은 기존 테이블을 삭제하고 새로 만듭니다. 개발 중에만 사용하도록 주의하세요.
  .then(() => {
    console.log(`Server is running on port ${PORT}`);
  })
  .catch((err: Error) => {
    console.error("Unable to sync with the database:", err);
  });

// [설명] 서버를 시작하는 코드입니다. 3000 포트에서 리스닝합니다.
const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
