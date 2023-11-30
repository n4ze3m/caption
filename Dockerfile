FROM node:18-slim as server
WORKDIR /app

RUN apt update
RUN npm --no-update-notifier --no-fund --global install pnpm

COPY . .
RUN pnpm install

RUN pnpm build

FROM node:18-slim
WORKDIR /app

RUN apt update && apt -y install --no-install-recommends ca-certificates git git-lfs openssh-client curl jq cmake sqlite3 openssl psmisc python3
RUN apt -y install g++ make
RUN npm install -g node-gyp
RUN apt-get clean autoclean && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/
RUN npm --no-update-notifier --no-fund --global install pnpm
# Copy API
COPY --from=server /app/apps/api/package.json .
COPY --from=server /app/apps/api/dist/ .
# Copy UI
COPY --from=server /app/apps/ui/dist/ ./public

RUN yarn install --production  --frozen-lockfile

ENV NODE_ENV=production

CMD ["yarn", "start"]