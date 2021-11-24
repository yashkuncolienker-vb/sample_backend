FROM node:14.17.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
# RUN npm install -g pm2
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]