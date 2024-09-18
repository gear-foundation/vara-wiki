FROM node:18-alpine AS builder
WORKDIR /vara-wiki
COPY . /vara-wiki
RUN npm install --force
RUN npm run build

FROM node:18-alpine AS production
RUN npm cache clean --force && npm install --omit=dev
WORKDIR /vara-wiki

COPY --from=builder /vara-wiki/build ./build
COPY --from=builder /vara-wiki/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--no-open"]
