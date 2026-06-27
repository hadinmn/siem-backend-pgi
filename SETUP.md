# Setup Instructions

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js v22 LTS](https://nodejs.org)
- [Git](https://git-scm.com)

## 1. Clone the Repository

```bash
git clone https://github.com/hadinmn/siem-backend-pgi.git
cd siem-backend-pgi
```

## 2. Setup Environment Variables

```bash
cp .env.example .env
```

Default `.env` values:

```
PORT=3000
PG_CONNECTION_STRING=postgres://backend_user:secretpassword@localhost:5432/siem_db
ES_NODE=http://localhost:9200
DATABASE_URL=postgresql://backend_user:secretpassword@localhost:5432/siem_db?schema=public
```

> **Note:** If PostgreSQL port 5432 is already in use on your machine, change the host port to 5433 in `docker-compose.yml` and update `.env` accordingly.

## 3. Option A — Run with Docker (Recommended)

This will start PostgreSQL, Elasticsearch, ES data initializer, and the backend service all at once:

```bash
docker-compose up -d
```

Wait ~30 seconds for all services to be ready, then run the database migration:

```bash
docker exec -i test-rdbms psql -U backend_user -d siem_db < migrations/001_create_highlighted_ips.sql
```

Then verify:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "services": {
    "postgres": "up",
    "elasticsearch": "up"
  }
}
```

## 4. Option B — Run Locally (Development)

### Install Dependencies

```bash
npm install
```

### Start Infrastructure Only

```bash
docker-compose up -d rdbms elasticsearch es-initializer
```

### Run Database Migration

```bash
docker exec -i test-rdbms psql -U backend_user -d siem_db < migrations/001_create_highlighted_ips.sql
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Start Development Server

```bash
npm run dev
```

## 5. Verify Setup

```bash
# Health check
curl http://localhost:3000/health

# Check ES data (should return count: 24)
curl http://localhost:9200/security-alerts/_count
```

## 6. API Documentation

Open in browser after the server is running:

```
http://localhost:3000/api-docs
```

## Troubleshooting

### ES initializer fails on Windows (CRLF issue)

```bash
sed -i 's/\r//' init-es/setup-es.sh
docker-compose restart es-initializer
```

### ES index is empty after docker restart

```bash
# Create index
curl -X PUT "http://localhost:9200/security-alerts" \
  -H "Content-Type: application/json" \
  -d '{"mappings":{"properties":{"timestamp":{"type":"date"},"src_ip":{"type":"ip"},"network_target_ip":{"type":"ip"},"signature_name":{"type":"keyword"},"severity":{"type":"integer"}}}}'

# Insert data
curl -X POST "http://localhost:9200/security-alerts/_bulk" \
  -H "Content-Type: application/json" \
  --data-binary @init-es/bulk-data.json
```

### Port conflict on 5432

Update `docker-compose.yml`:

```yaml
rdbms:
  ports:
    - "5433:5432"
```

And update `.env`:

```
PG_CONNECTION_STRING=postgres://backend_user:secretpassword@localhost:5433/siem_db
DATABASE_URL=postgresql://backend_user:secretpassword@localhost:5433/siem_db?schema=public
```