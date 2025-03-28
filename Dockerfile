# Stage 1: Build Stage
FROM node:22.14.0-alpine3.21 AS build

# Set working directory
WORKDIR /app

# Install dependencies early to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the React Vite project with specified mode
RUN npm run build

# Stage 2: Nginx Serve Stage
FROM nginx:1.27.4-alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY ci/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]