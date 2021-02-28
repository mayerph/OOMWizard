FROM node:alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /opt/app/

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]