# Stage 1: Build the TypeScript application
FROM node:lts AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Create the production image
FROM node:lts-slim

USER node

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

ENTRYPOINT [ "node", "dist/index.js" ]
