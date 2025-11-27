# ---- Base image ----
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    # ---- Production image ----
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=8080
    
    # Copy only production package files
    COPY package*.json ./
    
    # Install only production dependencies
    RUN npm install --omit=dev
    
    # Copy built code
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 8080
    
    CMD ["node", "dist/main.js"]
    