FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./

COPY ./.env* ./

COPY . .

RUN npm install


EXPOSE 3400

CMD ["npm", "run", "start"]

