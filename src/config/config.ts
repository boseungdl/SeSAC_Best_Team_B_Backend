// export type Env = 'development' | 'production' | 'test';
import { Dialect } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

export type Env = 'development'


interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
  // 필요한 다른 설정들을 추가할 수 있습니다.
}

const config: Record<Env, DatabaseConfig> = {
  development: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: process.env.DB_DIALECT as "mysql",
  },
};

export default config;