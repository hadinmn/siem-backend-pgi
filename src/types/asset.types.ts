export interface Asset {
  id: number;
  asset_name: string;
  host_identifier_local: string;
  department_owner: string;
  risk_level: string;
}

export interface TopTargetedAsset {
  target_ip: string;
  total_attacks: number;
  asset_name: string | null;
  department: string | null;
}