export interface HighlightedIp {
    id: number;
    ip_address: string;
    reason: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}

export interface CreateHighlightedIpDto {
    ip_address: string;
    reason?: string;
}

export interface UpdateHighlightedIpDto {
    ip_address?: string;
    reason?: string;
}