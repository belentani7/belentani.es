# Multi-stage production image for the Next.js application.
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["pnpm", "start"]
