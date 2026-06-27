import prisma from '../config/db';
import esClient from '../config/elasticsearch';

export const checkPostgres = async (): Promise<boolean> => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch {
        return false;
    }
};

export const checkElasticsearch = async (): Promise<boolean> => {
    try {
        await esClient.ping();
        return true;
    } catch {
        return false;
    }
};