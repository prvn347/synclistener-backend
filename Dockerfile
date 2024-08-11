FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./
COPY prisma ./

RUN npm install
COPY . .

RUN npx prisma migrate dev
RUN npm run build

EXPOSE 3001

CMD [ "npm","start" ]