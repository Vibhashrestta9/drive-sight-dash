
export interface SimCard {
  id: string;
  iccid: string;
  status: 'active' | 'inactive' | 'error' | 'no-sim';
  signalStrength: number;
  carrier: string;
  dataUsage: {
    used: number;
    total: number;
  };
}

export interface ModemSettings {
  apn: string;
  username: string;
  password: string;
  networkType: '2g' | '3g' | '4g' | '5g' | 'auto';
  roaming: boolean;
  powerSaveMode: boolean;
}
