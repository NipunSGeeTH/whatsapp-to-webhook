FROM node:18-bullseye

# Install system dependencies for puppeteer and chromium
RUN apt-get update && apt-get install -y \
    chromium \
    libxss1 \
    libnss3 \
    libgconf-2-4 \
    fonts-liberation \
    libgbm1 \
    libxrender1 \
    xdg-utils \
    wget \
    ca-certificates \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Create directories for auth and logs
RUN mkdir -p .wwebjs_auth logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["pnpm", "start"]
