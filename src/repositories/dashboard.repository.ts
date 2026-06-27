import esClient from '../config/elasticsearch';
import pool from '../config/db';

export const getTopTargetedIps = async (): Promise<{ ip: string; count: number }[]> => {
    const result = await esClient.search({
        index: 'security-alerts',
        size: 0,
        aggregations: {
            top_targets: {
                terms: {
                    field: 'network_target_ip',
                    size: 5,
                },
            },
        },
    });

    const buckets = (
        result.aggregations?.top_targets as {
            buckets: { key: string; doc_count: number }[];
        }
    ).buckets;

    return buckets.map((b) => ({ ip: b.key, count: b.doc_count }));
};

export const getAssetsByIps = async (
    ips: string[]
): Promise<{ host_identifier_local: string; asset_name: string; department_owner: string }[]> => {
    const result = await pool.query(
        `SELECT host_identifier_local, asset_name, department_owner
     FROM internal_infrastructure_assets
     WHERE host_identifier_local = ANY($1)`,
        [ips]
    );
    return result.rows;
};