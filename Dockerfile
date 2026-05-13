# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies
RUN bun install

# Set dummy environment variables for build-time validation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    CORS_ORIGIN="http://localhost:3000" \
    JWT_SECRET="dummy_secret_key_for_build" \
    SUPABASE_URL="https://dummy.supabase.co" \
    SUPABASE_SERVICE_ROLE_KEY="dummy_key" \
    NEXT_PUBLIC_SERVER_URL="http://localhost:3000" \
    NODE_ENV="production"

# Generate Prisma Client
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    CORS_ORIGIN="http://localhost:3000" \
    JWT_SECRET="dummy_secret_key_for_build" \
    SUPABASE_URL="https://dummy.supabase.co" \
    SUPABASE_SERVICE_ROLE_KEY="dummy_key" \
    NEXT_PUBLIC_SERVER_URL="http://localhost:3000" \
    bun run db:generate

# Build the project
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    CORS_ORIGIN="http://localhost:3000" \
    JWT_SECRET="dummy_secret_key_for_build" \
    SUPABASE_URL="https://dummy.supabase.co" \
    SUPABASE_SERVICE_ROLE_KEY="dummy_key" \
    NEXT_PUBLIC_SERVER_URL="http://localhost:3000" \
    bun run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "apps/server/src/index.ts"]
