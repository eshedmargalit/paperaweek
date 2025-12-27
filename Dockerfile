# Phase 1: Client Build
FROM node:24-alpine as builder
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /usr/src/app
COPY ./client ./
RUN yarn install
RUN yarn build

# Phase 2: Server Build
FROM node:24-alpine
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /server
COPY ./server .
COPY --from=builder /usr/src/app/build ../client/build
RUN yarn --production
CMD ["yarn", "start"]
