import { Component, inject, signal } from '@angular/core';
import { HistoryService } from '../../shared/services/history.service';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [DatePipe, JsonPipe],
  templateUrl: './history.html',
})
export class History {
 copiedId = signal<string | null>(null);
  historyService = inject(HistoryService);
  history = this.historyService.history;

  async copyToClipboard(entry: any) {
    try {
      const text = JSON.stringify(entry.parsedData, null, 2);
      await navigator.clipboard.writeText(text);
      this.copiedId.set(entry.id);
      setTimeout(() => this.copiedId.set(null), 2000);
      
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard.');
    }
  }
}
