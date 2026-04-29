import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-query-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './query-input.html'
})
export class QueryInput {
  hasDictionary = input.required<boolean>();
  rawInput = input.required<string>();
  
  rawInputChange = output<string>();
  clearAll = output<void>();
  process = output<void>();

  onInputChanged(val: string) {
    this.rawInputChange.emit(val);
  }
}
