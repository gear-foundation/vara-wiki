FROM node:18-alpine AS builder
WORKDIR /vara-wiki
COPY . /vara-wiki
RUN npm install --force
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /vara-wiki

COPY --from=builder /vara-wiki/dist ./dist
COPY --from=builder /vara-wiki/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--no-open"]
