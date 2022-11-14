FROM node:16-alpine AS builder
WORKDIR /vara-wiki
COPY . /vara-wiki
RUN npm install --force
RUN npm run build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /whitepaper/build /usr/share/nginx/html
