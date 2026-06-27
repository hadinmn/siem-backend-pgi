import prisma from '../config/db';
import esClient from '../config/elasticsearch';
import { HighlightedIp, AlertResponse } from '../types';

export const createHighlightedIp = async (
    ip_address: string,
    reason?: string
): Promise<HighlightedIp> => {
    return prisma.highlighted_ips.create({
        data: { ip_address, reason },
    });
};

export const findAllHighlightedIps = async (): Promise<HighlightedIp[]> => {
    return prisma.highlighted_ips.findMany({
        orderBy: { created_at: 'desc' },
    });
};

export const updateHighlightedIp = async (
    id: number,
    ip_address?: string,
    reason?: string
): Promise<HighlightedIp | null> => {
    try {
        return await prisma.highlighted_ips.update({
            where: { id },
            data: {
                ...(ip_address && { ip_address }),
                ...(reason && { reason }),
                updated_at: new Date(),
            },
        });
    } catch {
        return null;
    }
};

export const deleteHighlightedIp = async (
    id: number
): Promise<HighlightedIp | null> => {
    try {
        return await prisma.highlighted_ips.delete({
            where: { id },
        });
    } catch {
        return null;
    }
};

export const findHighlightedIpAddresses = async (): Promise<string[]> => {
    const result = await prisma.highlighted_ips.findMany({
        select: { ip_address: true },
    });
    return result.map((r) => r.ip_address);
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