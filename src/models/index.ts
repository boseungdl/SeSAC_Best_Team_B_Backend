import { Sequelize } from 'sequelize-typescript';
import config from '../config/config';

const env = (process.env.NODE_ENV || 'development') as keyof typeof config;

const sequelize = new Sequelize({
  ...config[env],
  models: [__dirname + '/tables'],  // 모델 파일들의 위치를 지정합니다.
});

export default sequelize