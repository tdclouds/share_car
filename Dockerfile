FROM node:20.11.1 as builder

WORKDIR /code/

ADD . /code/

RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx

COPY --from=builder /code/dist /usr/share/nginx/html
COPY --from=builder /code/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
