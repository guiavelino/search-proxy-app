FROM node:22-alpine AS base
WORKDIR /app

# --- Dependencies (all) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM deps AS build
COPY . .
RUN npm run build

# --- Production dependencies only ---
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- Production ---
FROM base AS production
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN mkdir -p data

EXPOSE 3000
CMD ["node", "dist/main.js"]
