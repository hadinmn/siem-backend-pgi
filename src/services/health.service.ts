import { checkPostgres, checkElasticsearch } from '../repositories/health.repository';

interface HealthStatus {
    status: 'healthy' | 'unhealthy';
    services: {
        postgres: 'up' | 'down';
        elasticsearch: 'up' | 'down';
    };
}

export const getHealthStatus = async (): Promise<HealthStatus> => {
    const [postgresOk, elasticsearchOk] = await Promise.all([
        checkPostgres(),
        checkElasticsearch(),
    ]);

    const status = postgresOk && elasticsearchOk ? 'healthy' : 'unhealthy';

    return {
        status,
        services: {
            postgres: postgresOk ? 'up' : 'down',
            elasticsearch: elasticsearchOk ? 'up' : 'down',
        },
    };
};