# ===== Build =====
FROM node:20-alpine AS build
WORKDIR /app

# Instala deps con cache de capas
COPY package*.json ./
RUN npm ci

# Copia el resto del código (incluye .env si lo usas para Vite)
COPY . .

# (OPCIONAL) si quieres inyectar la URL en tiempo de build desde el workflow:
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ===== Run (Nginx) =====
FROM nginx:stable-alpine
# Copia el build al docroot
COPY --from=build /app/dist /usr/share/nginx/html
# Config SPA de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
