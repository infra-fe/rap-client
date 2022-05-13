# BUILDING
FROM node:16-alpine AS builder

ENV NODE_OPTIONS='--max-old-space-size=4096'

WORKDIR /app

COPY . ./

# 替换后端端口地址配置文件
COPY docker/config.prod.ts ./src/config/config.prod.ts

# 在国内打开下面一行加速
#RUN npm config set registry https://registry.npm.taobao.org/ && npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass

RUN yarn --ignore-engines

RUN yarn build

# nginx
FROM nginx:stable-alpine

ENV  RAP_SERVER='http://rapserver:38081'

COPY --from=builder app/build /rapclient

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

COPY docker-entrypoint.sh /

RUN chmod 777 /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 38081

CMD ["nginx","-g","daemon off;"]


