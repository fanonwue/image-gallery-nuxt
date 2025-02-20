ARG WORKDIR=/opt/app

FROM node:22-alpine AS builder
ARG WORKDIR
WORKDIR $WORKDIR
COPY . .
RUN npm ci
RUN npm run prisma:generate
RUN npm run build

FROM node:22-alpine
ARG WORKDIR
WORKDIR $WORKDIR
COPY docker/entrypoint.sh .
RUN chmod +x entrypoint.sh && mkdir data

ENV NODE_ENV=production
ENV DATABASE_URL="file:${WORKDIR}/data/main.db"
ENV NUXT_SESSION_PASSWORD="CHANGE_ME"

COPY prisma prisma
COPY docker/package*.json .
RUN npm ci
COPY --from=builder $WORKDIR/.output/ .

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "./server/index.mjs"]