# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (need devDeps for TypeScript compiler)
COPY package*.json ./
RUN npm install

# Copy source and build TS -> JS
COPY . .
RUN npm run build          # expects compiled JS in ./dist

# ---- runtime stage ----
FROM node:20-alpine
RUN apk update && apk upgrade
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output (and any runtime assets)
COPY --from=builder /app/dist ./dist

# Expose your app port (change if your app uses another)
EXPOSE 5000

# Start the compiled app
CMD ["node", "dist/index.js"]