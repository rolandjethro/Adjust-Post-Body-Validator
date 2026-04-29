import { CommonModule, JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { Navbar } from './components/navbar/navbar';
import { QueryInput } from './components/query-input/query-input';
import { InspectorResults } from './components/inspector-results/inspector-results';

@Component({
  selector: 'app-root',
  imports: [CommonModule, History, Navbar, QueryInput, InspectorResults],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private modalService = inject(NgbModal);
  eventService = inject(EventMappingService);
  private titleService = inject(Title);
  public themeService = inject(ThemeService);
  private historyService = inject(HistoryService);

  rawInput = signal('');
  jsonOutput = signal<any>(null);
  syntaxErrors = signal<string[]>([]);
  isDarkMode = signal(false);
  showModal = signal(false);
  validationResult = signal<ValidationResult | null>(null);
  isRevenueEvent = signal(false);
  matchedEventName = signal<string | null>(null);
  matchedEventToken = signal<string | null>(null);
  currentYear = new Date().getFullYear();

  hasDictionary = computed(() => this.eventService.eventList().length > 0);
  version = signal('1.2.0');

  constructor() {
    this.titleService.setTitle("Daam - Adjust Query Inspector");

    effect(() => {
      const list = this.eventService.eventList();
      this.clearAll();
    }, { allowSignalWrites: true });
  }

  process() {
    const raw = this.rawInput().trim();
    const input = raw.replace(/["']\\?$/g, '').replace(/^["']/g, '');

    this.jsonOutput.set(null);
    this.syntaxErrors.set([]);
    this.validationResult.set(null);
    this.isRevenueEvent.set(false);
    this.matchedEventName.set(null);
    this.matchedEventToken.set(null);

    if (!input) return;
    if (this.eventService.eventList().length === 0) {
      this.syntaxErrors.set([
        "Dictionary Error: No event mappings found. Please upload a CSV file in the Dictionary modal before processing."
      ]);
      return;
    }

    if (!this.hasDictionary()) {
      this.syntaxErrors.set([
        "Dictionary Error: No event mappings found. Please upload a CSV file in the Dictionary modal before processing."
      ]);
      return;
    }

    try {
      const params = new URLSearchParams(input);
      const result: any = {};
      let formatError = null;
      params.forEach((val, key) => {
        try {
          result[key] = this.formatValue(val);
        } catch (e: any) {
          formatError = `Format Error in ${key}: ${e.message}`;
        }
      });

      if (formatError) {
        this.syntaxErrors.set([formatError]);
        return;
      }
      this.jsonOutput.set(result);

      const alerts: import('./shared/models/event.model').ValidationAlert[] = [];
      const ua = result.user_agent || '';

      // 0. APP TOKEN VALIDATION (TOP PRIORITY)
      const expectedAppToken = this.eventService.appToken().trim();
      if (!expectedAppToken) {
        alerts.push({ 
          type: 'danger', 
          message: `Dictionary Error: Adjust App Token is missing in your dictionary. Please set it in the Dictionary modal to validate payload compliance.` 
        });
      } else if (result.app_token && result.app_token !== expectedAppToken) {
        alerts.push({ 
          type: 'danger', 
          message: `Compliance Failed: App Token mismatch. Expected '${expectedAppToken}' but found '${result.app_token}'.` 
        });
      }

      // 1. EVENT TOKEN DICTIONARY MATCH
      const eventToken = result.event_token;
      const matchedEvent = this.eventService.eventList().find(e => e.token === eventToken);

      if (matchedEvent) {
        this.matchedEventName.set(matchedEvent.name);
        this.matchedEventToken.set(matchedEvent.token);
        if (matchedEvent.isRevenue) {
          this.isRevenueEvent.set(true);
        }
      } else if (eventToken) {
        alerts.push({ type: 'danger', message: `Dictionary Error: Token '${eventToken}' was not found on your Adjust app events token.` });
      }

      // 2. REQUIRED PARAMETERS
      const missingRequired: string[] = [];
      ['s2s', 'app_token', 'event_token'].forEach(key => {
        if (!result[key]) missingRequired.push(key);
      });
      if (missingRequired.length > 0) {
        alerts.push({ type: 'danger', message: `Missing required parameters: ${missingRequired.join(', ')}` });
      }

      // 3. DEVICE IDENTIFIER PARAMETERS
      const identifiers = ['adid', 'gps_adid', 'idfa', 'idfv'];
      const hasIdentifier = identifiers.some(key => !!result[key]);
      if (!hasIdentifier) {
        alerts.push({ type: 'danger', message: `Missing Device Identifier. At least one of adid, gps_adid, idfa, or idfv is required.` });
      }

      // 4. RECOMMENDED PARAMETERS
      const recommended = ['user_agent', 'created_at_unix', 'ip_address'];
      const missingRecommended: string[] = [];
      recommended.forEach(key => {
        if (!result[key]) {
          missingRecommended.push(key);
        } else {
          if (key === 'created_at_unix') {
            const val = Number(result[key]);
            if (isNaN(val) || val <= 0) {
              alerts.push({ type: 'warning', message: `Invalid 'created_at_unix': must be a valid numeric UNIX timestamp.` });
            }
          }
          if (key === 'ip_address') {
            const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
            if (!ipRegex.test(result[key])) {
              alerts.push({ type: 'warning', message: `Invalid 'ip_address' format.` });
            }
          }
        }
      });

      if (missingRecommended.length > 0) {
        alerts.push({ type: 'info', message: `For accurate event attribution, include the following parameters with your events: ${missingRecommended.join(', ')}` });
      }

      // 5. REVENUE EVENTS PARAMETERS
      if (matchedEvent && matchedEvent.isRevenue) {
        if (!result.revenue || !result.currency) {
          alerts.push({ type: 'danger', message: `Currency and revenue parameter are required to mark the event on Adjust.` });
        }
      }

      if (!result.environment) {
        alerts.push({ type: 'warning', message: `Environment parameter is missing. It will default to 'production'.` });
      } else if (!['production', 'sandbox'].includes(result.environment)) {
        alerts.push({ type: 'warning', message: `Environment Error: Use 'production' or 'sandbox'.` });
      }

      // 6. CUSTOM DATA PARAMETERS
      const customParams = ['partner_params', 'callback_params'];
      const missingCustom: string[] = [];
      customParams.forEach(key => {
        if (!result[key]) {
          missingCustom.push(key);
        } else if (typeof result[key] === 'string') {
          alerts.push({ type: 'warning', message: `Custom Data Warning: '${key}' must be a valid URL-encoded JSON object.` });
        }
      });

      if (missingCustom.length > 0) {
        alerts.push({ type: 'info', message: `Optional Custom Data parameters missing: ${missingCustom.join(', ')}` });
      }

      // 7. FINALIZE RESULT
      const hasDanger = alerts.some(a => a.type === 'danger');
      if (!hasDanger) {
        alerts.unshift({ type: 'success', message: `Payload formatting and compliance checks passed.` });
      }

      const finalValidation: ValidationResult = {
        isValid: !hasDanger,
        alerts
      };

      this.validationResult.set(finalValidation);
      this.historyService.addEntry(
        this.matchedEventName() || 'Unknown Event', 
        result.event_token || 'N/A', 
        finalValidation, 
        result,
        this.rawInput()
      );

    } catch (err) {
      this.syntaxErrors.set(["Critical Error: Unparseable format."]);
    }
  }

  formatValue(val: any): any {
    // If it's already an object/array (not a string), process its children
    if (val !== null && typeof val === 'object') {
      Object.keys(val).forEach(key => {
        val[key] = this.formatValue(val[key]);
      });
      return val;
    }

    // If it's not a string, we can't parse it further
    if (typeof val !== 'string' || !val) return val;

    const trimmed = val.trim();

    // Check if it looks like a JSON object or array
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        // RECURSION: Check if the parsed content contains more stringified JSON
        return this.formatValue(parsed);
      } catch (e) {
        // Logic to catch actual truncation
        const isLikelyTruncated = trimmed.endsWith('%') || /%[0-9A-F]$/i.test(trimmed) || trimmed.endsWith(',');
        if (isLikelyTruncated) {
          throw new Error("Incomplete or invalid JSON structure (likely truncated).");
        }
        return val; // It's just a string with brackets
      }
    }
    return val;
  }


  clearAll() {
    this.rawInput.set('');
    this.jsonOutput.set(null);
    this.syntaxErrors.set([]);
    this.isRevenueEvent.set(false);
    this.matchedEventName.set(null);
    this.matchedEventToken.set(null);
    this.validationResult.set({
      isValid: false,
      alerts: []
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

