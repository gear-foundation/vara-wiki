FROM node:18-alpine AS builder
WORKDIR /vara-wiki
COPY . /vara-wiki
RUN npm install --force
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /vara-wiki

COPY --from=builder /vara-wiki/build ./build
COPY --from=builder /vara-wiki/package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force && npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--no-open"]
