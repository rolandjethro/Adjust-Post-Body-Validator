export interface EventMapping {
  name: string;
  token: string;
  isRevenue?: boolean;
}

export interface ValidationAlert {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  alerts: ValidationAlert[];
}

export interface EventData {
  token: string;
  isRevenue?: boolean;
}

export type EventDictionary = Record<string, EventData>;