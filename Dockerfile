FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY yarn.lock package*.json ./
RUN yarn install

COPY . .

EXPOSE 8080
CMD ["yarn", "start:dev"]
