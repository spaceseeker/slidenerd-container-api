FROM node:8.9.3

WORKDIR /usr/src/app

RUN git clone https://github.com/spaceseeker/slidenerd-container-api.git /usr/src/app

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]