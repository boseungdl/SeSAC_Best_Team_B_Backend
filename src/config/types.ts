// config/types.ts
export interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql'; // 여기서는 사용하는 DB에 따라 필요한 방언(dialect)을 추가하거나 제거합니다.
    [prop: string]: any; // 추가적인 설정을 위해 index signature를 정의합니다.
  }
  
  export interface Config {
    development: DatabaseConfig;
    production: DatabaseConfig;
    test: DatabaseConfig;
    [env: string]: DatabaseConfig; // 환경변수에 따라 DatabaseConfig 형식으로 접근 가능하게 합니다.
  }