import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, of, tap } from 'rxjs';

import { ClaimAuthResponse } from '../models/claim.models';
import { AttendanceTicket, AuthUserProfile } from '../models/ticket.models';
import { TicketClaimApiService } from './ticket-claim-api.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly api = inject(TicketClaimApiService);
  private readonly authStorageKey = 'tikves-claim-auth';

  private readonly authState = signal<ClaimAuthResponse | null>(this.readStoredAuth());
  private readonly profileState = signal<AuthUserProfile | null>(null);
  private readonly ticketsState = signal<AttendanceTicket[]>([]);
  private readonly walletLoadedState = signal(false);

  readonly auth = this.authState.asReadonly();
  readonly profile = this.profileState.asReadonly();
  readonly tickets = this.ticketsState.asReadonly();
  readonly walletLoaded = this.walletLoadedState.asReadonly();
  readonly hasSession = computed(() => this.authState() !== null && !!this.authState()?.token);

  storeAuth(auth: ClaimAuthResponse): void {
    this.authState.set(auth);
    this.walletLoadedState.set(false);
    sessionStorage.setItem(this.authStorageKey, JSON.stringify(auth));
  }

  clearSession(): void {
    this.authState.set(null);
    this.profileState.set(null);
    this.ticketsState.set([]);
    this.walletLoadedState.set(false);
    sessionStorage.removeItem(this.authStorageKey);
  }

  accessToken(): string | null {
    return this.authState()?.token ?? null;
  }

  ensureWalletLoaded(): Observable<void> {
    if (!this.hasSession()) {
      return of(void 0);
    }

    if (this.walletLoadedState()) {
      return of(void 0);
    }

    return forkJoin({
      profile: this.api.loadProfile(),
      attendances: this.api.loadAttendances()
    }).pipe(
      tap(({ profile, attendances }) => {
        this.profileState.set(profile);
        this.ticketsState.set(attendances.data ?? []);
        this.walletLoadedState.set(true);
      }),
      map(() => void 0)
    );
  }

  private readStoredAuth(): ClaimAuthResponse | null {
    const raw = sessionStorage.getItem(this.authStorageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as ClaimAuthResponse;
    } catch {
      sessionStorage.removeItem(this.authStorageKey);
      return null;
    }
  }
}
