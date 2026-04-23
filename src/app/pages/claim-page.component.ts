import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ClaimStartPayload } from '../core/models/claim.models';
import { I18nService } from '../core/services/i18n.service';
import { SessionService } from '../core/services/session.service';
import { TicketClaimApiService } from '../core/services/ticket-claim-api.service';

@Component({
  selector: 'app-claim-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './claim-page.component.html',
  styleUrls: ['./claim-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(TicketClaimApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly i18n = inject(I18nService);
  readonly session = inject(SessionService);

  readonly stage = signal<'details' | 'verify'>('details');
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly isVerifying = signal(false);
  readonly resendSeconds = signal(0);
  readonly savedPayload = signal<ClaimStartPayload | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  private countdownTimer: number | null = null;

  ngOnInit(): void {
    if (this.session.hasSession()) {
      void this.router.navigateByUrl('/tickets');
      return;
    }

    const invitedEmail = this.route.snapshot.queryParamMap.get('email');
    if (invitedEmail) {
      this.form.controls.email.setValue(invitedEmail);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownTimer !== null) {
      window.clearInterval(this.countdownTimer);
    }
  }

  submitDetails(): void {
    this.errorMessage.set(null);
    this.form.controls.firstName.markAsTouched();
    this.form.controls.lastName.markAsTouched();
    this.form.controls.phone.markAsTouched();
    this.form.controls.email.markAsTouched();

    if (this.form.controls.firstName.invalid || this.form.controls.lastName.invalid || this.form.controls.phone.invalid || this.form.controls.email.invalid) {
      return;
    }

    const payload = this.buildPayload();
    this.isSubmitting.set(true);
    this.api.startClaim(payload).subscribe({
      next: () => {
        this.savedPayload.set(payload);
        this.stage.set('verify');
        this.form.controls.code.reset('');
        this.startCountdown();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.errorMessage.set(this.i18n.t('claim.form.genericError'));
        this.isSubmitting.set(false);
      }
    });
  }

  verifyCode(): void {
    this.errorMessage.set(null);
    this.form.controls.code.markAsTouched();

    const payload = this.savedPayload();
    if (!payload || this.form.controls.code.invalid) {
      return;
    }

    this.isVerifying.set(true);
    this.api.verifyClaim({ ...payload, code: this.form.controls.code.value.trim() }).subscribe({
      next: (auth) => {
        this.session.storeAuth(auth);
        this.session.ensureWalletLoaded().subscribe({
          next: () => {
            this.isVerifying.set(false);
            void this.router.navigateByUrl('/tickets');
          },
          error: () => {
            this.isVerifying.set(false);
            this.errorMessage.set(this.i18n.t('claim.form.genericError'));
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isVerifying.set(false);
        this.errorMessage.set(error.status === 401 ? this.i18n.t('claim.form.invalidCode') : this.i18n.t('claim.form.genericError'));
      }
    });
  }

  resendCode(): void {
    const payload = this.savedPayload();
    if (!payload || this.resendSeconds() > 0) {
      return;
    }

    this.errorMessage.set(null);
    this.api.startClaim(payload).subscribe({
      next: () => this.startCountdown(),
      error: () => this.errorMessage.set(this.i18n.t('claim.form.genericError'))
    });
  }

  backToDetails(): void {
    this.stage.set('details');
    this.errorMessage.set(null);
  }

  resendLabel(): string {
    return this.resendSeconds() > 0
      ? this.text('claim.form.resendWait', 'Resend available in {seconds}s', { seconds: this.resendSeconds() })
      : this.text('claim.form.resend', 'Request new code');
  }

  text(key: Parameters<I18nService['t']>[0], fallback: string, params?: Record<string, string | number>): string {
    const value = this.i18n.t(key, params);
    return value?.trim().length ? value : fallback;
  }

  private buildPayload(): ClaimStartPayload {
    return {
      firstName: this.form.controls.firstName.value.trim(),
      lastName: this.form.controls.lastName.value.trim(),
      phone: this.form.controls.phone.value.trim(),
      email: this.form.controls.email.value.trim().toLowerCase()
    };
  }

  private startCountdown(): void {
    if (this.countdownTimer !== null) {
      window.clearInterval(this.countdownTimer);
    }

    this.resendSeconds.set(60);
    this.countdownTimer = window.setInterval(() => {
      const nextValue = this.resendSeconds() - 1;
      if (nextValue <= 0) {
        this.resendSeconds.set(0);
        if (this.countdownTimer !== null) {
          window.clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
        return;
      }

      this.resendSeconds.set(nextValue);
    }, 1000);
  }
}
