# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies
RUN bun install

# Generate Prisma Client
RUN bun run db:generate

# Build the project
RUN bun run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "apps/server/src/index.ts"]
