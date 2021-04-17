FROM node:15.14.0-alpine3.10

WORKDIR /server/

COPY ./package*.json ./

RUN npm install

COPY ./out ./out

EXPOSE 8080

COPY ./startServer.sh ./

RUN chmod u+x ./startServer.sh

CMD npm start