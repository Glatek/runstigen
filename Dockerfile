FROM node:22-alpine AS installer
WORKDIR /app

COPY package*.json .
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=installer /app /app
COPY . .

RUN npm run build

FROM karlsson/deno-file-server:latest AS release
WORKDIR /usr/app/src

COPY --from=builder /app .

EXPOSE 8000
