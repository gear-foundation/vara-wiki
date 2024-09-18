FROM node:18-alpine
WORKDIR /vara-wiki
COPY . /vara-wiki
RUN npm install --force
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--no-open"]
