.PHONY: help build up down logs clean test

help:
	@echo "cEd Platform - Makefile Commands"
	@echo ""
	@echo "  make build      - Build all Go services"
	@echo "  make up         - Start all services with docker-compose"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make test       - Run tests for all services"

build:
	@echo "Building user-service..."
	cd user-service && go build -o bin/user-service .
	@echo "Building git-service..."
	cd git-service && go build -o bin/git-service .
	@echo "Building alm-service..."
	cd alm-service && go build -o bin/alm-service .

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	rm -rf user-service/bin git-service/bin alm-service/bin

test:
	cd user-service && go test ./...
	cd git-service && go test ./...
	cd alm-service && go test ./...

