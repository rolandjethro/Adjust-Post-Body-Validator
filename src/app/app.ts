import { CommonModule,  JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EventMappingService } from './shared/services/event-mapping.service';
import { EventDictionary } from './components/event-dictionary/event-dictionary';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from './shared/services/theme.service';
import { Title } from '@angular/platform-browser';
import { History } from './components/history/history';
import { HistoryService } from './shared/services/history.service';
import { ValidationResult } from './shared/models/event.model';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe, FormsModule, CommonModule, History],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private modalService = inject(NgbModal);
  private eventService = inject(EventMappingService);
  private titleService = inject(Title);
  public themeService = inject(ThemeService);
  private historyService = inject(HistoryService);

  rawInput = signal('');
  jsonOutput = signal<any>(null);
  syntaxErrors = signal<string[]>([]);
  isDarkMode = signal(false);
  showModal = signal(false);
  validationResult = signal<ValidationResult | null>(null);

  constructor() {
    this.titleService.setTitle("Daam - Adjust Query Validator");
  }

process() {
  const raw = this.rawInput().trim();
  const input = raw.replace(/["']\\?$/g, '').replace(/^["']/g, '');
  
  this.jsonOutput.set(null);
  this.syntaxErrors.set([]);
  this.validationResult.set(null);

  if (!input) return;

  try {
    const params = new URLSearchParams(input);
    const result: any = {};
    params.forEach((val, key) => { result[key] = this.formatValue(val); });
    this.jsonOutput.set(result);

    const errors: string[] = [];
    const ua = result.user_agent || '';
    
    // 1. DETECT PLATFORM ONLY VIA USER AGENT
    let detectedPlatform = '';
    if (ua) {
      if (/android/i.test(ua)) detectedPlatform = 'android';
      else if (/(iphone|ipad|ipod)/i.test(ua)) detectedPlatform = 'ios';
    }

    // 2. GLOBAL MANDATORY CHECKS (The "Big 6" + adid)
    const required = ['event_token', 'app_token', 'user_agent', 'created_at_unix', 'ip_address', 'environment', 'adid'];
    required.forEach(key => {
      if (!result[key]) errors.push(`Missing Required: ${key}`);
    });

    // 3. ENVIRONMENT CHECK
    if (result.environment && !['production', 'sandbox'].includes(result.environment)) {
      errors.push("Environment Error: Use 'production' or 'sandbox' only");
    }

    // 4. PLATFORM-SPECIFIC DEVICE ID RULES
    if (detectedPlatform === 'android') {
      if (!result.gps_adid) errors.push("Android Check: 'gps_adid' is missing");
      if (result.idfa || result.idfv) errors.push("Android Check: Found iOS IDs (idfa/idfv) in Android payload");
    } 
    else if (detectedPlatform === 'ios') {
      if (!result.idfv) errors.push("iOS Check: 'idfv' is missing");
    } 
    else {
      errors.push("Platform Check: Could not identify OS from User Agent. Validation incomplete.");
    }

    // 5. REVENUE & PURCHASE RULES
    const isPurchase = result.callback_params?.event_name?.toLowerCase().includes('purchase') || !!result.revenue;
    if (isPurchase) {
      if (!result.revenue) errors.push("Purchase Check: 'revenue' is required");
      if (!result.currency) errors.push("Purchase Check: 'currency' is required");
    }

    // 6. FINALIZE RESULT
    const finalValidation: ValidationResult = {
      isValid: errors.length === 0,
      message: errors.length > 0 ? errors.join(' | ') : `Valid ${detectedPlatform.toUpperCase()} Payload`,
      type: errors.length > 0 ? 'danger' : 'success'
    };

    this.validationResult.set(finalValidation);
    this.historyService.addEntry(result.callback_params?.event_name || 'Event', result.event_token, finalValidation, result);

  } catch (err) {
    this.syntaxErrors.set(["Critical Error: Unparseable format."]);
  }
  }
  

 private formatValue(val: string): any {
  let decoded = val;
  
  try {
    decoded = decodeURIComponent(val);
  } catch { /* use original if it fails */ }

  if (!decoded.startsWith('{') && !decoded.startsWith('[')) {
    return decoded;
  }

  try {
    const parsed = JSON.parse(decoded);
    if (typeof parsed === 'object' && parsed !== null) {
      Object.keys(parsed).forEach(key => {
        if (typeof parsed[key] === 'string' && (parsed[key].startsWith('{') || parsed[key].startsWith('['))) {
          parsed[key] = this.formatValue(parsed[key]);
        }
      });
    }
    return parsed;
  } catch {
    return decoded;
  }
}

  clearAll() {
  this.rawInput.set('');
  this.jsonOutput.set(null);
  this.syntaxErrors.set([]);
  this.validationResult.set({ 
    isValid: false, 
    message: '', 
    type: null 
  });
  }
  
  openDictionary() {
    this.modalService.open(EventDictionary, { 
      size: 'lg', 
      centered: true, 
      scrollable: true,
      backdropClass: 'custom-modal-backdrop'
    });
  }

  
}

