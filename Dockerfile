# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Kopieer de build-output naar de Nginx-webroot
COPY --from=build /app/dist/datalab-portal/browser/ /usr/share/nginx/html

# Expose poort 80
EXPOSE 80

# Start Nginx wanneer de container wordt gestart
CMD ["nginx", "-g", "daemon off;"]



