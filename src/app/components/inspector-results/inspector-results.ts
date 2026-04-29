import { Component, input, output } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ValidationResult } from '../../shared/models/event.model';

@Component({
  selector: 'app-inspector-results',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './inspector-results.html'
})
export class InspectorResults {
  hasDictionary = input.required<boolean>();
  rawInput = input.required<string>();
  jsonOutput = input.required<any>();
  syntaxErrors = input.required<string[]>();
  validationResult = input.required<ValidationResult | null>();
  isRevenueEvent = input<boolean>(false);
  matchedEventName = input<string | null>(null);
  matchedEventToken = input<string | null>(null);

  openDictionary = output<void>();
}
