# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init wget \
    && addgroup -S nodeapp \
    && adduser -S nodeapp -G nodeapp \
    && mkdir -p /app/public/uploads \
    && chown -R nodeapp:nodeapp /app
COPY --from=deps --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --chown=nodeapp:nodeapp . .
USER nodeapp
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/healthz || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
