# Phase 1: Client Build
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY ./client ./
RUN yarn install --production
RUN yarn build

# Phase 2: Server Build
FROM node:14-alpine
WORKDIR /server
COPY ./server .
COPY --from=builder /usr/src/app/build ../client/build
RUN yarn install --production
CMD ["yarn", "start"]
