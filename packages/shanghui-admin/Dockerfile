FROM node:16.18.1-alpine as build
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn config set registry https://public-ops-nexus-inc.9kd.com/repository/group-npm/ && yarn
COPY . ./
ARG PROJECT_ENV
RUN yarn lint
RUN yarn run build:${PROJECT_ENV}

FROM kaidicloud-registry.cn-shanghai.cr.aliyuncs.com/ops/nginx:1.20
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/scrm-webapp
