FROM node:lts-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json /app/
RUN npm install 
RUN npm install react-scripts -g

COPY . /app/

RUN npm run build 

EXPOSE 3000

CMD ["npm", "start"]