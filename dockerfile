# Base Image
FROM node:18-alpine

# Set home directory for the app user
ENV HOME=/home/app-user
ENV NPM_CONFIG_PREFIX=$HOME/.npm-global

# Create a non-root user and set permissions
RUN adduser -D -h $HOME app-user
RUN mkdir -p $HOME/app

# Set up npm global package installation path
RUN mkdir -p $HOME/.npm-global
RUN npm config set prefix '~/.npm-global'

# Ensure npm global bin path is added to the PATH
ENV PATH=$HOME/.npm-global/bin:$PATH

# Fix permissions for app directory
RUN chown -R app-user:app-user $HOME

# Set working directory
WORKDIR $HOME/app

# Switch to non-root user
USER app-user

# Copy package files first (not .env, as it is passed in via docker-compose)
COPY --chown=app-user:app-user package.json package-lock.json ./

# Install dependencies with unsafe-perm to avoid permission errors
RUN npm install --unsafe-perm=true

# Copy the rest of the application code
COPY --chown=app-user:app-user . .

# Build Prisma client
RUN npx prisma generate

# Ensure .next directory is created with the correct permissions
RUN mkdir -p $HOME/app/.next \
    && chmod -R 777 $HOME/app/.next  # Allow full access

# Switch back to root to install PostgreSQL and set it up
USER root

# Install PostgreSQL
RUN apk add --no-cache postgresql postgresql-contrib

# Ensure proper ownership of PostgreSQL directories
RUN mkdir -p /var/lib/postgresql/data /run/postgresql /tmp \
    && chown -R postgres:postgres /var/lib/postgresql /run/postgresql /tmp

# Switch to postgres user for database setup
USER postgres

# Initialize PostgreSQL and start the server
CMD ["/bin/sh", "-c", "\
    pg_ctl initdb -D /var/lib/postgresql/data && \
    echo \"unix_socket_directories = '/tmp'\" >> /var/lib/postgresql/data/postgresql.conf && \
    postgres -D /var/lib/postgresql/data & \
    until pg_isready -h localhost -p 5432; do \
      echo 'Waiting for PostgreSQL...'; \
      sleep 2; \
    done && \
    psql -h localhost -U postgres -tc \"SELECT 1 FROM pg_database WHERE datname = 'paymentsdb'\" | grep -q 1 || psql -h localhost -U postgres -c \"CREATE DATABASE paymentsdb\" && \
    npx prisma migrate deploy && \
    npm run dev \
"]
