FROM node:22 AS base

# Set the working directory inside the container
WORKDIR /app

# Install Python, build tools, and dependencies required for node-gyp and canvas
RUN apt-get update
RUN apt-get install -y python3 make g++ libcairo2-dev libpango1.0-dev libgif-dev libjpeg-dev libpng-dev libpixman-1-dev
RUN apt-get install -y npm
RUN npm install -g bun

# Copy package.json and bun.lockb first (to cache dependency installation)
COPY package.json bun.lockb ./

# Install bun and install dependencies
RUN bun install

# Rebuild canvas to ensure compatibility with the container environment
RUN npm rebuild canvas

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Run tests
RUN bun run test

# Build the Next.js app
RUN bun run build

# Expose the port Next.js will run on
EXPOSE 3000

# Command to run migrations before starting the app
CMD ["sh", "-c", "bunx prisma migrate deploy || true && bun run start"]
