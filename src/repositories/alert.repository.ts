import prisma from '../config/db';
import esClient from '../config/elasticsearch';
import { AlertResponse } from '../types';
import type { AlertQueryInput } from '../validations';

export const getAssetIpsByFilter = async (
    department?: string,
    risk?: string
): Promise<string[]> => {
    const assets = await prisma.internal_infrastructure_assets.findMany({
        where: {
            ...(department && { department_owner: department }),
            ...(risk && { risk_level: risk }),
        },
        select: {
            host_identifier_local: true,
        },
    });

    return assets.map((a) => a.host_identifier_local);
};

export const searchAlerts = async (
    ips: string[],
    params: AlertQueryInput
): Promise<{ total: number; data: AlertResponse[] }> => {
    const {
        severity,
        date_from,
        date_to,
        sort_by = 'timestamp',
        order = 'desc',
        page = 1,
        limit = 20,
    } = params;

    const must: object[] = [];

    if (ips.length > 0) {
        must.push({ terms: { network_target_ip: ips } });
    }

    if (severity) {
        must.push({ term: { severity } });
    }

    if (date_from || date_to) {
        const range: Record<string, string> = {};
        if (date_from) range.gte = date_from;
        if (date_to) range.lte = date_to;
        must.push({ range: { timestamp: range } });
    }

    const esQuery = must.length > 0 ? { bool: { must } } : { match_all: {} };

    const from = (page - 1) * limit;

    const result = await esClient.search({
        index: 'security-alerts',
        query: esQuery,
        sort: [{ [sort_by]: { order } }],
        from,
        size: limit,
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