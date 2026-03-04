.PHONY: up down build start postgres

# Levantar API, sistema y PostgreSQL local
up:
	docker compose up -d --build

# Levantar solo PostgreSQL (para desarrollo local con npm run dev)
postgres:
	docker compose up -d postgres

# Levantar en primer plano (ver logs)
up-logs:
	docker compose up --build

# Detener todos los servicios
down:
	docker compose down

# Construir imágenes sin levantar
build:
	docker compose build

# Reiniciar ambos
restart:
	docker compose restart
