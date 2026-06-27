# SIEM Dashboard Backend

Backend API service for a Security Information and Event Management (SIEM) Dashboard built with **Node.js**, **TypeScript**, **PostgreSQL** (via Prisma ORM), and **Elasticsearch**.

The service integrates PostgreSQL and Elasticsearch to provide security alert monitoring, dashboard aggregation, and highlighted IP management.

## Tech Stack

- **Runtime:** Node.js 22
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma v6
- **Databases:** PostgreSQL, Elasticsearch
- **Validation:** Zod
- **Documentation:** Swagger UI

## Architecture

4-layer separation of concerns:

```
Controller → Service → Repository → Database (PostgreSQL / Elasticsearch)
```

## Features

- Advanced alert filtering by department, risk level, severity, and date range
- Dashboard aggregation — Top 5 most targeted assets enriched with asset info
- Highlighted IP monitoring with full CRUD and activity tracking
- Health check endpoint for service connectivity verification
- Request validation with Zod
- Sorting support and pagination
- OpenAPI / Swagger documentation
- Dockerized application

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET |  `/health` | Health check |
| GET | `/alerts` | Filtered alert logs |
| GET | `/dashboard/top-targeted` | Top 5 targeted assets |
| POST | `/highlighted-ips` | Add highlighted IP |
| GET | `/highlighted-ips` | List highlighted IPs |
| PUT | `/highlighted-ips/{id}` | Update highlighted IP |
| DELETE | `/highlighted-ips/{id}` | Delete highlighted IP |
| GET | `/highlighted-ips/activity` | Activity from highlighted IPs |

Full API documentation available at `http://localhost:3000/api-docs`

## Assumptions & Design Decisions

- `network_target_ip` in Elasticsearch is correlated with `host_identifier_local` in PostgreSQL to identify asset ownership.
- Filtering is performed at the Elasticsearch level — PostgreSQL is only queried to translate `department`/`risk` filters into IP lists.
- Elasticsearch `terms` aggregation is used for Top 5 targeted assets to handle millions of records efficiently without fetching raw documents.
- `highlighted_ips` table uses a `UNIQUE` constraint on `ip_address` to prevent duplicate entries.
- `highlighted-ips/activity` returns an empty array when no IPs are highlighted to avoid unnecessary ES queries.
- Pagination uses `from/size` which is appropriate for the given requirement of millions of records. `search_after` would be more suitable if deep pagination (e.g. page 50,000+) were required, but the requirement does not specify this.
- Prisma ORM is used for PostgreSQL to ensure type-safe database access in TypeScript.

## Trade-offs & Limitations

- No authentication/authorization on endpoints (out of scope for this assessment).
- ES data is not persistent across `docker-compose down -v` (volume not configured).
- `es-initializer` container may fail on Windows due to CRLF line endings in `setup-es.sh` — see SETUP.md for manual fix.

## Future Improvements

- Implement authentication (JWT) on all endpoints.
- Add caching (Redis) for frequently accessed aggregation results.
- Add rate limiting to prevent abuse.
- Implement `search_after` pagination if deep pagination is required.
- CI/CD pipeline for automated testing and deployment.
