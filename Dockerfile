FROM node:12.22-alpine3.14 as build
ARG PROJECT_ENV
WORKDIR /usr/src/app
COPY . ./
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install && npm run build:${PROJECT_ENV}

FROM djj-registry.cn-shanghai.cr.aliyuncs.com/ops/nginx:1.20
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/ecadmin
