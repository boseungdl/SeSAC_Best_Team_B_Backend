// config/config.ts: Sequelize 설정을 위한 파일

export default {
  development: {
    username: "admin",
    password: "qwer1234",
    database: "test-rds",
    host: "test-rds.caortczun2j4.ap-northeast-2.rds.amazonaws.com",
    dialect: "mysql",
    // operatorsAliases: false
  }
  // ... 다른 환경 설정 (예: production, test)
};