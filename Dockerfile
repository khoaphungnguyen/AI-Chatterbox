# Adjust BUN_VERSION as desired
ARG BUN_VERSION=latest
FROM oven/bun:${BUN_VERSION} as base

# Set the working directory for the app
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package.json and bun.lockb (if exists) to /app
COPY package.json bun.lockb* /app/

# Install dependencies
RUN bun install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the application (modify the build script as necessary)
RUN bun next build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app using bun (modify as necessary)
CMD ["bun", "start"]
