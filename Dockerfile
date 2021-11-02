FROM node:12.22.1-alpine as build
WORKDIR /usr/src/app
COPY . ./
ARG PROJECT_ENV
RUN npm i --registry=https://public-ops-nexus-inc.9kd.com/repository/group-npm/ && \
npm install && npm run build:${PROJECT_ENV}

FROM djj-registry.cn-shanghai.cr.aliyuncs.com/ops/nginx:1.20
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/yy_admin
