FROM node:20-alpine

WORKDIR /app

COPY agent/package*.json ./agent/

WORKDIR /app/agent
RUN npm install

COPY agent/ ./

RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["npx", "tsx", "src/server.ts"]
