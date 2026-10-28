FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/sequelize-cli db:migrate && exec node src/server.js"]