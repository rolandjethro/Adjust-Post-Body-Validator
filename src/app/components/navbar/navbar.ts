import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  themeService = inject(ThemeService);
  
  version = input.required<string>();
  openDictionary = output<void>();
}
