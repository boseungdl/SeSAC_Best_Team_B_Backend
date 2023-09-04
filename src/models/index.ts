import { Sequelize } from "sequelize-typescript";
import config from "../config/config";
import User from "./tables/user";
import Image from "./tables/image";
import Record from "./tables/record";

const env = (process.env.NODE_ENV || "development") as keyof typeof config;

const sequelize = new Sequelize({
  ...config[env],
  models: [User, Record, Image], // 모델 파일들의 위치를 지정합니다.
});

export default sequelize;
