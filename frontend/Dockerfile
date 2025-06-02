# Frontend Dockerfile for Vite + React
# Uses Node for build, then serves with nginx for performance
FROM node:20-alpine as build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# Production image
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY frontend/public/robots.txt /usr/share/nginx/html/robots.txt
COPY frontend/public/manifest.json /usr/share/nginx/html/manifest.json
COPY frontend/public/favicon.ico /usr/share/nginx/html/favicon.ico
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
