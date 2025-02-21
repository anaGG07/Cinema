FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Configurar Vite para escuchar en todas las interfaces
ENV VITE_HOST=0.0.0.0

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]