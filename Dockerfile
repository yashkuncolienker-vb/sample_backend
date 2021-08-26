FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
# RUN npm install -g pm2
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]