export interface EventMapping {
  name: string;
  token: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info' | null; // These are Literals
}

export type EventDictionary = Record<string, string>;