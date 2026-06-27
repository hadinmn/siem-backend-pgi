import { getTopTargetedIps, getAssetsByIps } from '../repositories/dashboard.repository';
import { TopTargetedAsset } from '../types';

export const getTopTargetedAssets = async (): Promise<TopTargetedAsset[]> => {

    const topIps = await getTopTargetedIps();

    if (topIps.length === 0) return [];

    const ips = topIps.map((item) => item.ip);
    const assets = await getAssetsByIps(ips);

    const assetMap = new Map(
        assets.map((a) => [
            a.host_identifier_local,
            { asset_name: a.asset_name, department: a.department_owner },
        ])
    );

    return topIps.map((item) => ({
        target_ip: item.ip,
        total_attacks: item.count,
        asset_name: assetMap.get(item.ip)?.asset_name ?? null,
        department: assetMap.get(item.ip)?.department ?? null,
    }));
};