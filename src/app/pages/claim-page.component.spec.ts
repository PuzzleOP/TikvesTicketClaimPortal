import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ClaimAuthResponse } from '../core/models/claim.models';
import { I18nService } from '../core/services/i18n.service';
import { SessionService } from '../core/services/session.service';
import { TicketClaimApiService } from '../core/services/ticket-claim-api.service';
import { ClaimPageComponent } from './claim-page.component';

describe('ClaimPageComponent', () => {
  let fixture: ComponentFixture<ClaimPageComponent>;
  let component: ClaimPageComponent;
  let api: jasmine.SpyObj<TicketClaimApiService>;
  let session: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;

  const auth: ClaimAuthResponse = {
    id: 'user-1',
    application: 'tikves',
    username: 'guest@example.com',
    email: 'guest@example.com',
    tenant: 'default',
    token: 'token',
    refresh: 'refresh',
    expiration: '2026-05-08T12:00:00Z',
    authorities: []
  };

  beforeEach(() => {
    api = jasmine.createSpyObj<TicketClaimApiService>('TicketClaimApiService', [
      'loadRegistrationForm',
      'startClaim',
      'verifyClaim'
    ]);
    session = jasmine.createSpyObj<SessionService>('SessionService', ['hasSession', 'storeAuth', 'ensureWalletLoaded']);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    api.loadRegistrationForm.and.returnValue(of({ fields: [], requiresTermsAcceptance: true }));
    api.startClaim.and.returnValue(of(void 0));
    api.verifyClaim.and.returnValue(of(auth));
    session.hasSession.and.returnValue(false);
    session.ensureWalletLoaded.and.returnValue(of(void 0));
    router.navigateByUrl.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [ClaimPageComponent],
      providers: [
        I18nService,
        { provide: TicketClaimApiService, useValue: api },
        { provide: SessionService, useValue: session },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({})
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ClaimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('requires terms acceptance when the registration form says terms are required', () => {
    fillDetails();
    component.loadRegistrationForm();
    fixture.detectChanges();

    expect(component.requiresTermsAcceptance()).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('I accept the event terms and conditions.');

    component.submitDetails();

    expect(api.startClaim).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBe('Accepting the event terms is required.');
  });

  it('sends acceptedTerms when starting and verifying a claim', () => {
    fillDetails();
    component.loadRegistrationForm();
    component.acceptedTerms.set(true);

    component.submitDetails();

    expect(api.startClaim).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'guest@example.com',
      acceptedTerms: true
    }));

    component.form.controls.code.setValue('123456');
    component.verifyCode();

    expect(api.verifyClaim).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'guest@example.com',
      code: '123456',
      acceptedTerms: true
    }));
  });

  it('passes eventId to form, start, and verify requests when scoped', () => {
    component.eventId.set('event-1');
    fillDetails();
    component.loadRegistrationForm();
    component.acceptedTerms.set(true);

    expect(api.loadRegistrationForm).toHaveBeenCalledWith('guest@example.com', 'event-1');

    component.submitDetails();
    component.form.controls.code.setValue('123456');
    component.verifyCode();

    expect(api.startClaim).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'guest@example.com',
      eventId: 'event-1'
    }));
    expect(api.verifyClaim).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'guest@example.com',
      eventId: 'event-1',
      code: '123456'
    }));
  });

  function fillDetails(): void {
    component.form.controls.firstName.setValue('Ana');
    component.form.controls.lastName.setValue('Guest');
    component.form.controls.phone.setValue('070123456');
    component.form.controls.email.setValue('guest@example.com');
  }
});
