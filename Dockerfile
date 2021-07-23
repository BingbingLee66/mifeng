FROM node:12.22.1-alpine as build
ARG PROJECT_ENV
WORKDIR /usr/src/app
COPY . ./
RUN npm config set registry https://registry.npm.taobao.org
RUN yarn install && npm run build:${PROJECT_ENV}

FROM nginx:1.18.0
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/ecadmin
