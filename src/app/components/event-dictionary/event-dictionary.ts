import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMappingService } from '../../shared/services/event-mapping.service';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-dictionary',
  imports: [CommonModule, NgbModule],
  templateUrl: './event-dictionary.html',
})
export class EventDictionary {
  public eventService = inject(EventMappingService);
  activeModal = inject(NgbActiveModal);

  allEvents = this.eventService.eventList;
  closeRequested = output<void>(); 

  errorMessage = signal<string | null>(null); 
  successMessage = signal<string | null>(null);
  isConfirmingClear = signal(false);

  // search
  searchQuery = signal('');

  filteredEventList = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allEvents();
    
    return this.allEvents().filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.token.toLowerCase().includes(query)
    );
  });

  handleUpload(event: any) {
   this.isConfirmingClear.set(false);
    const file = event.target.files[0];
    if (!file) return;

    this.errorMessage.set(null);
   this.successMessage.set(null);
   

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.eventService.parseCSV(e.target?.result as string);
        this.successMessage.set('Dictionary updated successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
        
      } catch (err: any) {
        this.errorMessage.set(err.message);
      } finally {
        event.target.value = ''; 
      }
    };
    reader.readAsText(file);
  }

  startClearProcess() {
    this.isConfirmingClear.set(true);
  }  

  deleteEverything() {
    this.eventService.clear();
    this.isConfirmingClear.set(false);
    this.successMessage.set('Dictionary cleared');
    setTimeout(() => this.successMessage.set(null), 2000);
  }

  toggleRevenueStatus(name: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.eventService.toggleRevenue(name, isChecked);
  }

  dismissModal() {
    if (!this.eventService.appToken()) {
      this.errorMessage.set('Warning: Adjust App Token is empty. This is required for payload validation.');
      const confirmClose = window.confirm('Adjust App Token is missing. Validation will fail without it. Close anyway?');
      if (!confirmClose) return;
    }
    this.activeModal.close();
  }
}
