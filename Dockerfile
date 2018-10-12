FROM node:8.12.0-alpine as source

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.14.0-alpine
WORKDIR /opt/app
COPY default.template /etc/nginx/conf.d/default.conf
COPY compression.template /etc/nginx/conf.d/compression.conf
COPY --from=source /usr/src/app/dist .