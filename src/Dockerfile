FROM node:10

WORKDIR /app

COPY package.json /app
RUN npm install pm2 -g
RUN npm install
COPY . /app
EXPOSE 3001
#CMD ["node", "app.js"]
CMD ["pm2-runtime", "app.js"]