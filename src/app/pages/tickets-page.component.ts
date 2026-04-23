import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AttendanceTicket, TicketGroup } from '../core/models/ticket.models';
import { I18nService } from '../core/services/i18n.service';
import { SessionService } from '../core/services/session.service';
import { TicketClaimApiService } from '../core/services/ticket-claim-api.service';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(TicketClaimApiService);

  readonly session = inject(SessionService);
  readonly i18n = inject(I18nService);
  readonly loading = signal(true);
  readonly sendingEventId = signal<string | null>(null);
  readonly emailStatusMessage = signal<string | null>(null);
  readonly emailErrorMessage = signal<string | null>(null);

  readonly activeGroups = computed(() => this.groupTickets(this.session.tickets().filter((ticket) => ticket.status !== 'CANCELLED')));
  readonly cancelledGroups = computed(() => this.groupTickets(this.session.tickets().filter((ticket) => ticket.status === 'CANCELLED')));

  ngOnInit(): void {
    if (!this.session.hasSession()) {
      void this.router.navigateByUrl('/claim');
      return;
    }

    this.session.ensureWalletLoaded().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }

  localizeStatus(status: string): string {
    if (status === 'VERIFIED') {
      return this.i18n.t('status.verified');
    }

    if (status === 'CANCELLED') {
      return this.i18n.t('status.cancelled');
    }

    return this.i18n.t('status.active');
  }

  qrSource(ticket: AttendanceTicket): string {
    return `data:image/png;base64,${ticket.code}`;
  }

  isSendingEvent(eventId: string): boolean {
    return this.sendingEventId() === eventId;
  }

  sendEventTicketsToEmail(group: TicketGroup): void {
    if (this.sendingEventId()) {
      return;
    }

    this.emailStatusMessage.set(null);
    this.emailErrorMessage.set(null);
    this.sendingEventId.set(group.eventId);

    this.api.sendEventTicketsToEmail(group.eventId)
      .pipe(finalize(() => this.sendingEventId.set(null)))
      .subscribe({
        next: (response) => {
          this.emailStatusMessage.set(this.i18n.t('tickets.emailSent', {
            event: group.eventName,
            email: response.email
          }));
        },
        error: () => {
          this.emailErrorMessage.set(this.i18n.t('tickets.emailFailed', {
            event: group.eventName
          }));
        }
      });
  }

  formatEventWindow(group: TicketGroup): string {
    const locale = this.i18n.locale();
    const { eventStart, eventEnd } = group;
    if (!eventStart) {
      return '';
    }

    const startDate = new Date(eventStart);
    const start = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(startDate);

    if (!eventEnd) {
      return start;
    }

    const end = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(eventEnd));

    return `${start} - ${end}`;
  }

  signOut(): void {
    this.session.clearSession();
    void this.router.navigateByUrl('/claim');
  }

  private groupTickets(tickets: AttendanceTicket[]): TicketGroup[] {
    const groups = new Map<string, TicketGroup>();

    for (const ticket of tickets) {
      const existing = groups.get(ticket.eventId);
      if (existing) {
        existing.tickets.push(ticket);
        continue;
      }

      groups.set(ticket.eventId, {
        eventId: ticket.eventId,
        eventName: this.i18n.localize(ticket.event.name),
        eventStart: ticket.event.timeStart ?? ticket.timeStart,
        eventEnd: ticket.event.timeEnd ?? ticket.timeEnd,
        tickets: [ticket]
      });
    }

    return Array.from(groups.values()).sort((left, right) => (left.eventStart ?? '').localeCompare(right.eventStart ?? ''));
  }
}
