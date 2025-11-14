# Этап 1: Установка зависимостей
FROM node:alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --force

# Этап 2: Сборка приложения
FROM node:alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN NODE_OPTIONS="--localstorage-file=/tmp/localstorage" npm run build

# Этап 3: Финальный образ для запуска
FROM node:alpine AS runner
WORKDIR /app

# Устанавливаем только serve для отдачи статики
RUN npm install -g serve

# Копируем только собранный build
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
