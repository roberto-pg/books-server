FROM node:current-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN yarn

COPY . .

CMD ["yarn", "prod"]