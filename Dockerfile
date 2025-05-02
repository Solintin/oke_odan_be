# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/app.js"]