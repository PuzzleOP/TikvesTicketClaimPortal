import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ClaimAuthResponse, ClaimRegistrationFormResponse, ClaimStartPayload, ClaimVerifyPayload } from '../models/claim.models';
import { AttendancesResponse, AuthUserProfile, SendEventTicketsEmailResponse } from '../models/ticket.models';

@Injectable({ providedIn: 'root' })
export class TicketClaimApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  startClaim(payload: ClaimStartPayload): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/api/v1.0/tikves/public/ticket-claim/start`, payload);
  }

  loadRegistrationForm(email: string, eventId?: string | null): Observable<ClaimRegistrationFormResponse> {
    return this.http.post<ClaimRegistrationFormResponse>(
      `${this.apiBaseUrl}/api/v1.0/tikves/public/ticket-claim/form`,
      { email, eventId: eventId || undefined }
    );
  }

  verifyClaim(payload: ClaimVerifyPayload): Observable<ClaimAuthResponse> {
    return this.http.post<ClaimAuthResponse>(`${this.apiBaseUrl}/api/v1.0/tikves/public/ticket-claim/verify`, payload);
  }

  loadProfile(): Observable<AuthUserProfile> {
    return this.http.get<AuthUserProfile>(`${this.apiBaseUrl}/api/v1.0/tikves/auth/user`);
  }

  loadAttendances(): Observable<AttendancesResponse> {
    return this.http.get<AttendancesResponse>(`${this.apiBaseUrl}/api/v1.0/tikves/data/http/attendances`);
  }

  sendEventTicketsToEmail(eventId: string): Observable<SendEventTicketsEmailResponse> {
    return this.http.post<SendEventTicketsEmailResponse>(
      `${this.apiBaseUrl}/api/v1.0/tikves/data/http/attendances/events/${encodeURIComponent(eventId)}/email`,
      {}
    );
  }
}
