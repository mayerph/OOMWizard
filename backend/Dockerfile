FROM node

WORKDIR /app
COPY package*.json /app/


RUN apt-get update
RUN apt-get -y install curl
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"


RUN cargo --version
RUN apt-get -y install ffmpeg
RUN apt-get -y install git












RUN npm install --global neon-cli
RUN neon --version
RUN npm install

RUN neon build --release /app/node_modules/gifEndecoder

COPY . /app/

RUN npm run build

EXPOSE 2000

ENTRYPOINT [ "node", "dist/index.js" ]