# Usar una imagen ligera y actualizada de Node.js
FROM node:20-alpine

# Definir directorio de trabajo
WORKDIR /app

# Copiar solo los archivos de dependencias para optimizar la caché
COPY package*.json ./

# Instalar dependencias de forma segura
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto correcto
EXPOSE 4000

# Comando de inicio en producción
CMD ["npm", "start"]
