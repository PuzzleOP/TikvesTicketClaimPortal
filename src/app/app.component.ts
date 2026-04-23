import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { I18nService } from './core/services/i18n.service';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'Tikves Ticket Claim';
  readonly i18n = inject(I18nService);
  readonly session = inject(SessionService);

  setLanguage(language: 'en' | 'mk'): void {
    this.i18n.setLanguage(language);
  }
}
