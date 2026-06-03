# Merr Node.js version 20 si bazë
FROM node:20-alpine

# Krijo dhe shko në folder /app brenda container-it
WORKDIR /app

# Kopjo package.json dhe instalo dependencies
COPY package*.json ./
RUN npm install

# Kopjo gjithë kodin e projektit
COPY . .

# Hap portin 5000
EXPOSE 5000

# Nis serverin
CMD ["node", "server.js"]