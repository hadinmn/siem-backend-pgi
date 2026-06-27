export interface HighlightedIp {
    id: number;
    ip_address: string;
    reason: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateHighlightedIpDto {
    ip_address: string;
    reason?: string;
}

export interface UpdateHighlightedIpDto {
    ip_address?: string;
    reason?: string;
}