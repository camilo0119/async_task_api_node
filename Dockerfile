# Etapa de construcción
FROM node:18-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm install && npm ci && npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copiar archivos necesarios de la etapa de construcción
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Crear directorio de logs
RUN mkdir -p logs && chown -R nextjs:nodejs logs

# Cambiar al usuario no root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Configurar variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]