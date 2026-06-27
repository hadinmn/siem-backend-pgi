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