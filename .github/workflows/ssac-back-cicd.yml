# 먼저 의존성 패키지를 복사하고 설치
FROM node:18-buster-slim AS dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# 애플리케이션 소스 코드를 복사
FROM dependencies AS build
WORKDIR /usr/src/app
COPY . .
COPY ./webpackDevServer.config.js  /usr/src/app/node_modules/react-scripts/config/webpackDevServer.config.js 
RUN npm run build

FROM build AS start
COPY --from=build /usr/src/app/build /usr/src/app
EXPOSE 3000
CMD [ "npm", "start" ]
