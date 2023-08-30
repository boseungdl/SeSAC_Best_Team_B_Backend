import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import config from '../config/config';
import { Config } from '../config/types';  // 추가된 타입 가져오기

const env: string = (process.env.NODE_ENV as keyof Config) || 'development'; // 환경 변수의 타입을 keyof Config로 명시
const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  models: [path.join(__dirname, '/*.ts')],
});

export default sequelize;