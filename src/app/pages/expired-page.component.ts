import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-expired-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expired-page.component.html',
  styleUrls: ['./expired-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpiredPageComponent {
  readonly i18n = inject(I18nService);
}
