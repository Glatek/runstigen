FROM node:22-alpine AS installer
WORKDIR /app

COPY package*.json .
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=installer /app /app
COPY . .

RUN node --run build

FROM karlsson/deno-file-server:latest AS release
COPY --from=builder /app /usr/app/src

EXPOSE 8000
