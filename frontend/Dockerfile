# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the React app
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/build ./build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]
