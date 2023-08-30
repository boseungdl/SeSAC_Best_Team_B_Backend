// 필요한 모듈 및 타입들을 불러옵니다.
import express, { Express } from 'express';
// import db from './models';

const app: Express = express();  // `Express` 타입을 사용하여 app 변수의 타입을 명확하게 합니다.

// `||` 연산자는 앞의 값이 falsy일 때 뒤의 값을 사용하게 합니다. 
const PORT: number = Number(process.env.PORT) || 3000;

// db.sequelize.sync().then(() => {
//     console.log('DB synced!');
// }).catch((error: Error) => {  // `Error`는 JavaScript의 내장 객체 타입입니다.
//     console.error('DB sync error:', error);
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});