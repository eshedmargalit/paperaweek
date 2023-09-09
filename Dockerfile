# Phase 1: Client Build
FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY ./client ./
RUN yarn install
RUN yarn build

# Phase 2: Server Build
FROM node:18-alpine
WORKDIR /server
COPY ./server .
COPY --from=builder /usr/src/app/build ../client/build
RUN yarn --production
CMD ["yarn", "start"]
