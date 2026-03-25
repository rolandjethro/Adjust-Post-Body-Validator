import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EventDictionary, EventMapping, ValidationResult } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventMappingService {
  private readonly STORAGE_KEY = 'event_dictionary';
  private platformId = inject(PLATFORM_ID);

  // Private signal - only this service can modify it
  private _eventMap = signal<EventDictionary>({});
   events = signal<any>({});

  // Public readonly signals - components can read but not change directly
  readonly eventMap = this._eventMap.asReadonly();
  readonly eventList = computed<EventMapping[]>(() => 
    Object.entries(this._eventMap()).map(([name, token]) => ({ name, token }))
  );

  constructor() {
    this.loadFromStorage();
  }

  getEventsCount(): number {
  return Object.keys(this.events()).length;
 }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) this._eventMap.set(JSON.parse(saved));
    }
  }

  parseCSV(csvData: string): void {
  const lines = csvData.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  // Error 1: File is empty or just has a header
  if (lines.length < 2) {
    throw new Error("The CSV file appears to be empty or contains no data rows.");
  }

  const header = lines[0].toLowerCase().split(',').map(h => h.replace(/["']/g, '').trim());
  const tokenIdx = header.indexOf('token');
  const nameIdx = header.indexOf('name');

  // Error 2: Required columns are missing
  if (tokenIdx === -1 || nameIdx === -1) {
    throw new Error("Invalid Format: Could not find 'token' or 'name' columns in the header.");
  }

  const newMap: Record<string, string> = {};
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(item => item.replace(/["']/g, '').trim());
    const token = row[tokenIdx];
    const name = row[nameIdx];
    if (name && token) newMap[name] = token;
  }

  // Error 3: No valid pairs found
  if (Object.keys(newMap).length === 0) {
    throw new Error("No valid event mappings were found in the file.");
  }

  this._eventMap.set(newMap);
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newMap));
}

  validate(eventName: string, eventToken: string): ValidationResult {
    const expected = this._eventMap()[eventName];
    if (!eventToken || !eventName) return { isValid: false, message: "Missing required keys.", type: 'warning' };
    
    if (expected === eventToken) return { isValid: true, message: "Tokens Match Successfully", type: 'success' };
    
    return { 
      isValid: false, 
      message: expected ? `Mismatch: Expected ${expected}` : `Event "${eventName}" not in dictionary`, 
      type: 'danger' 
    };
  }

  clear() {
    this._eventMap.set({});
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.STORAGE_KEY);
  }
}
