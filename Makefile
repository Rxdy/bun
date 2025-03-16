ENV = dev

res:
	docker compose restart

up:
	docker compose up

down:
	docker compose down

mig:
	@if [ -z "$(name)" ]; then \
		echo "Error: 'name' variable is required. Usage: make mig name=migration_name"; \
		exit 1; \
	fi
	docker exec API-BUN sh -c "bunx prisma migrate dev --name $(name) && bunx prisma generate"

seed:
	docker exec -it API-BUN bun run scripts/seed.ts

test: 
	docker compose -f docker-compose.test.yml up --abort-on-container-exit