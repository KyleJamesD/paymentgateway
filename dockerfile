FROM node:18-alpine

# Install curl and Dockerize
RUN apk add --no-cache curl \
    && curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    | tar -C /usr/local/bin -xzv

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the app on port 3000
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "dev"]