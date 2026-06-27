CREATE TABLE IF NOT EXISTS highlighted_ips (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR NOT NULL UNIQUE,
    reason VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);