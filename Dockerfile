FROM node:14 AS builder
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /src
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:14
WORKDIR /app
COPY --from=builder /src .
CMD [ "npm", "start" ]