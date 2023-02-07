FROM node:14 as build
WORKDIR /usr/src/app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml .npmrc ./

RUN pnpm fetch --prod

RUN pnpm install -r --offline --prod

COPY . ./

ARG PROJECT_ENV
RUN pnpm -F mifeng run lint
RUN pnpm -F mifeng run build:${PROJECT_ENV}

FROM kaidicloud-registry.cn-shanghai.cr.aliyuncs.com/ops/nginx:1.20
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/scrm-webapp
