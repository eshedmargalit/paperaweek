# Phase 1: Client Build
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY ./client ./
RUN yarn
RUN yarn build

# Phase 2: Server Build
FROM node:14-alpine
WORKDIR /server
COPY ./server .
COPY --from=builder /usr/src/app/build ../client/build
RUN yarn --production
CMD ["yarn", "start"]
