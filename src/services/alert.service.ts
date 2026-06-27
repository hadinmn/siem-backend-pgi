import { getAssetIpsByFilter, searchAlerts } from '../repositories/alert.repository';
import { AlertResult } from '../types';
import type { AlertQueryInput } from '../validations';

export const getAlertLogs = async (params: AlertQueryInput): Promise<AlertResult> => {
    const { department, risk, page = 1, limit = 20 } = params;

    const ips = await getAssetIpsByFilter(department, risk);

    if (ips.length === 0 && (department || risk)) {
        return { total_data: 0, page, limit, data: [] };
    }

    const { total, data } = await searchAlerts(ips, params);
    return { total_data: total, page, limit, data };
};