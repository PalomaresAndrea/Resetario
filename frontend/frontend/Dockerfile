# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copia sólo package*.json para aprovechar la cache
COPY package*.json ./
RUN npm ci

# Copia el resto del código y construye
COPY . .
# (Opcional) Pasa variables Vite en build: --build-arg VITE_API_URL=...
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ---------- Runtime ----------
FROM nginx:1.27-alpine

# Utilidades para healthcheck
RUN apk add --no-cache curl

# Copia el build estático
COPY --from=build /app/dist /usr/share/nginx/html

# Template -> Nginx hará envsubst de ${BACKEND_URL} al arrancar
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Puerto que usará Azure App Service
EXPOSE 80

# Salúd de contenedor
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost/health || exit 1

# Valor por defecto para desarrollo local (puedes sobreescribirlo al correr)
ENV BACKEND_URL=http://host.docker.internal:3000/
