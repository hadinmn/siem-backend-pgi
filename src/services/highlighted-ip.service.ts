import {
    createHighlightedIp,
    findAllHighlightedIps,
    updateHighlightedIp,
    deleteHighlightedIp,
    findHighlightedIpAddresses,
    searchAlertsByIps,
} from '../repositories/highlighted-ip.repository';
import { HighlightedIp, AlertResponse, CreateHighlightedIpDto, UpdateHighlightedIpDto } from '../types';

export const addHighlightedIp = async (dto: CreateHighlightedIpDto): Promise<HighlightedIp> => {
    return createHighlightedIp(dto.ip_address, dto.reason);
};

export const listHighlightedIps = async (): Promise<HighlightedIp[]> => {
    return findAllHighlightedIps();
};

export const editHighlightedIp = async (
    id: number,
    dto: UpdateHighlightedIpDto
): Promise<HighlightedIp | null> => {
    return updateHighlightedIp(id, dto.ip_address, dto.reason);
};

export const removeHighlightedIp = async (id: number): Promise<HighlightedIp | null> => {
    return deleteHighlightedIp(id);
};

export const getHighlightedIpActivity = async (): Promise<{
    total_data: number;
    data: AlertResponse[];
}> => {
    const ips = await findHighlightedIpAddresses();

    if (ips.length === 0) {
        return { total_data: 0, data: [] };
    }

    const { total, data } = await searchAlertsByIps(ips);
    return { total_data: total, data };
};