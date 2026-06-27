export interface AlertResult {
    total_data: number;
    page: number;
    limit: number;
    data: AlertResponse[];
}

export interface AlertResponse {
    timestamp: string;
    source_ip: string;
    target_ip: string;
    alert_name: string;
    severity: number;
}

export interface AlertQueryParams {
    department?: string;
    risk?: string;
    severity?: number;
    date_from?: string;
    date_to?: string;
    sort_by?: 'timestamp' | 'severity';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}