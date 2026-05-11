# Kafka Social Microservices

Проект демонстрирует простую микросервисную архитектуру с Apache Kafka.

**Тема:** Посты и комментарии (соцсеть).

## Архитектура

- **api-service** — внешний HTTP API (порт 3000). Принимает данные, отправляет в Kafka, проксирует запросы поиска и отчётов.
- **data-service** — читает данные из Kafka, пишет в PostgreSQL, предоставляет поиск и отчёты (порт 3001).
- **Kafka + Zookeeper** — брокер сообщений.
- **PostgreSQL** — хранение постов и комментариев.

## Быстрый старт

# Сборка и запуск всех контейнеров
docker compose up -d --build

# После запуска можно проверить отчёты (в БД уже есть тестовые данные)
curl http://localhost:3000/api/reports/top-posts

## Технологии

Node.js, Express

KafkaJS

PostgreSQL

Docker, Docker Compose
