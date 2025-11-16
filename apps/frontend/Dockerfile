FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@8.12.0 --activate

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY apps/frontend ./apps/frontend
COPY turbo.json package.json ./
RUN cd apps/frontend && pnpm run build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /app/apps/frontend/public ./apps/frontend/public
COPY --from=build /app/apps/frontend/package.json ./apps/frontend/
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/frontend/node_modules ./apps/frontend/node_modules

WORKDIR /app/apps/frontend

EXPOSE 3000

CMD ["pnpm", "start"]
