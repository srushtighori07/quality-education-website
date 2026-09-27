FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native compilation
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --production

COPY . .

# Ensure database directory exists
RUN mkdir -p database

ENV PORT=3000
ENV NODE_ENV=production
ENV OWNER_PASSKEY=AdminEdu@2026

EXPOSE 3000

CMD ["node", "server.js"]
