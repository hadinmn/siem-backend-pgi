import pool from '../config/db';
import esClient from '../config/elasticsearch';
import { HighlightedIp, AlertResponse } from '../types';

export const createHighlightedIp = async (
    ip_address: string,
    reason?: string
): Promise<HighlightedIp> => {
    const result = await pool.query(
        `INSERT INTO highlighted_ips (ip_address, reason)
     VALUES ($1, $2) RETURNING *`,
        [ip_address, reason ?? null]
    );
    return result.rows[0];
};

export const findAllHighlightedIps = async (): Promise<HighlightedIp[]> => {
    const result = await pool.query(
        'SELECT * FROM highlighted_ips ORDER BY created_at DESC'
    );
    return result.rows;
};

export const updateHighlightedIp = async (
    id: number,
    ip_address?: string,
    reason?: string
): Promise<HighlightedIp | null> => {
    const result = await pool.query(
        `UPDATE highlighted_ips
     SET ip_address = COALESCE($1, ip_address),
         reason = COALESCE($2, reason),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
        [ip_address ?? null, reason ?? null, id]
    );
    return result.rows[0] ?? null;
};

export const deleteHighlightedIp = async (
    id: number
): Promise<HighlightedIp | null> => {
    const result = await pool.query(
        'DELETE FROM highlighted_ips WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] ?? null;
};

export const findHighlightedIpAddresses = async (): Promise<string[]> => {
    const result = await pool.query('SELECT ip_address FROM highlighted_ips');
    return result.rows.map((row) => row.ip_address);
};

export const searchAlertsByIps = async (
    ips: string[]
): Promise<{ total: number; data: AlertResponse[] }> => {
    const result = await esClient.search({
        index: 'security-alerts',
        query: { terms: { src_ip: ips } },
        sort: [{ timestamp: { order: 'desc' } }],
        size: 100,
        track_total_hits: true,
    });

    const total = (result.hits.total as { value: number }).value;
    const data: AlertResponse[] = result.hits.hits.map((hit) => {
        const source = hit._source as {
            timestamp: string;
            src_ip: string;
            network_target_ip: string;
            signature_name: string;
            severity: number;
        };
        return {
            timestamp: source.timestamp,
            source_ip: source.src_ip,
            target_ip: source.network_target_ip,
            alert_name: source.signature_name,
            severity: source.severity,
        };
    });

    return { total, data };
};