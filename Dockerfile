FROM node:24-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

###

FROM node:24-alpine AS runner

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs package*.json ./

RUN npm ci --omit=dev

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

CMD ["npm", "run", "start"]