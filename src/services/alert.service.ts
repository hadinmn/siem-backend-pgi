import { getAssetIpsByFilter, searchAlerts } from '../repositories/alert.repository';
import { AlertQueryParams, AlertResult } from '../types';

export const getAlertLogs = async (params: AlertQueryParams): Promise<AlertResult> => {
    const { department, risk, page = 1, limit = 20 } = params;

    const ips = await getAssetIpsByFilter(department, risk);

    if (ips.length === 0 && (department || risk)) {
        return { total_data: 0, page, limit, data: [] };
    }

    const { total, data } = await searchAlerts(ips, params);
    return { total_data: total, page, limit, data };
};