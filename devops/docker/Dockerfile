FROM node:22-slim AS builder

RUN apt update && apt install -y openssl procps git

WORKDIR /home/node/app
COPY . .

RUN chown -R node:node /home/node/app

USER node

RUN yarn
RUN yarn build



FROM node:22-slim

WORKDIR /home/node/app

COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/package.json ./package.json

RUN chown -R node:node /home/node/app
USER node

CMD ["yarn", "prod"]
