FROM oven/bun:1.2.20-alpine AS build

WORKDIR /src

COPY package.json .
COPY bun.lock .
COPY packages/server/package.json packages/server/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN bun i
COPY . .

RUN apk add bash

RUN cd packages/server && bunx prisma generate
RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]