# Merr Node.js version 20 si bazë
FROM node:20-alpine

# Krijo dhe shko në folder /app brenda container-it
WORKDIR /app

# Kopjo package.json nga folder backend dhe instalo dependencies
COPY backend/package*.json ./
RUN npm install

# Kopjo gjithë kodin e backend-it
COPY backend/src ./src
COPY backend/config ./config
COPY backend/models ./models

# Hap portin 5000
EXPOSE 5000

# Nis serverin
CMD ["node", "src/server.js"]