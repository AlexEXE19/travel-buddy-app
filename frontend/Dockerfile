FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@11.8.0
COPY package.json pnpm-lock.yaml ./
# --ignore-scripts skips dependency build scripts (e.g. sharp's native build),
# which pnpm 10+ otherwise refuses to run un-approved. sharp is optional and the
# app uses unoptimized images, so it is never invoked.
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm","run","start"]
