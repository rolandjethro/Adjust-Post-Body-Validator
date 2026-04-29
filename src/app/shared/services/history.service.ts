import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  eventName: string;
  eventToken: string;
  status: any;      
  parsedData: any;   
  rawInput: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly STORAGE_KEY = 'adjust_history';
  private platformId = inject(PLATFORM_ID);
  history = signal<HistoryEntry[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.history.set([]);
      localStorage.removeItem('adjust_history');
      console.log('History cleared for new session.');
    }
  }

  /**
   * Records a new validation event into the history array
   */
  addEntry(eventName: string, eventToken: string, status: any, parsedData: any, rawInput: string) {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventName: eventName || 'Unknown Event',
      eventToken: eventToken || 'N/A',
      status: { ...status }, // Clone the validation status
      parsedData: JSON.parse(JSON.stringify(parsedData)), // Deep clone the JSON result
      rawInput: rawInput
    };

    // Add to start of array, keep only last 15 items
    this.history.update(current => [newEntry, ...current]);
    
    this.saveHistory();
  }

  /**
   * Wipes the history from memory and local storage
   */
  clearHistory() {
    this.history.set([]);
    this.saveHistory();
  }

  private saveHistory() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history()));
    }
  }

  private loadHistory() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert timestamp strings back to Date objects
          const revived = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }));
          this.history.set(revived);
        } catch (err) {
          console.error("Failed to load history:", err);
          this.history.set([]);
        }
      }
    }
  }
}