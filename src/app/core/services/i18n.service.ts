import { Injectable, computed, signal } from '@angular/core';

import { LocalizedText } from '../models/ticket.models';

export type Language = 'en' | 'mk';

type TranslationKey =
  | 'brand.title'
  | 'brand.subtitle'
  | 'nav.claim'
  | 'nav.tickets'
  | 'nav.signOut'
  | 'claim.kicker'
  | 'claim.title'
  | 'claim.description'
  | 'claim.step.details'
  | 'claim.step.verify'
  | 'claim.form.firstName'
  | 'claim.form.lastName'
  | 'claim.form.phone'
  | 'claim.form.email'
  | 'claim.form.code'
  | 'claim.form.emailHint'
  | 'claim.form.phoneHint'
  | 'claim.form.submit'
  | 'claim.form.verify'
  | 'claim.form.back'
  | 'claim.form.resend'
  | 'claim.form.resendWait'
  | 'claim.form.sentHeadline'
  | 'claim.form.sentBody'
  | 'claim.form.invalidCode'
  | 'claim.form.genericError'
  | 'claim.sidebar.title'
  | 'claim.sidebar.body'
  | 'claim.sidebar.pointOne'
  | 'claim.sidebar.pointTwo'
  | 'claim.sidebar.pointThree'
  | 'tickets.kicker'
  | 'tickets.title'
  | 'tickets.subtitle'
  | 'tickets.empty'
  | 'tickets.loading'
  | 'tickets.active'
  | 'tickets.cancelled'
  | 'tickets.sendToEmail'
  | 'tickets.sendingToEmail'
  | 'tickets.emailSent'
  | 'tickets.emailFailed'
  | 'tickets.reference'
  | 'tickets.assignment'
  | 'tickets.status'
  | 'tickets.cancelledBlurb'
  | 'status.active'
  | 'status.verified'
  | 'status.cancelled'
  | 'expired.title'
  | 'expired.body'
  | 'expired.action';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    'brand.title': 'Tikves Ticket Claim',
    'brand.subtitle': 'Secure web claim for invited guests',
    'nav.claim': 'Claim',
    'nav.tickets': 'Tickets',
    'nav.signOut': 'Sign out',
    'claim.kicker': 'Ticket claim portal',
    'claim.title': 'Claim your emailed tickets without the mobile app.',
    'claim.description': 'Enter the invited recipient details exactly as they appear on the ticket email. We will send a one-time verification code to confirm the identity before the tickets are released.',
    'claim.step.details': 'Recipient details',
    'claim.step.verify': 'Email verification',
    'claim.form.firstName': 'First name',
    'claim.form.lastName': 'Last name',
    'claim.form.phone': 'Phone number',
    'claim.form.email': 'Email address',
    'claim.form.code': 'Verification code',
    'claim.form.emailHint': 'Use the same email address that received the invite bundle.',
    'claim.form.phoneHint': 'Digits only are stored after verification.',
    'claim.form.submit': 'Send verification code',
    'claim.form.verify': 'Confirm and open tickets',
    'claim.form.back': 'Edit details',
    'claim.form.resend': 'Request new code',
    'claim.form.resendWait': 'Resend available in {seconds}s',
    'claim.form.sentHeadline': 'Check your inbox',
    'claim.form.sentBody': 'A six-digit verification code was sent to {email}. Enter it below to unlock your ticket wallet.',
    'claim.form.invalidCode': 'The code is invalid or expired. Request a new code and try again.',
    'claim.form.genericError': 'We could not complete the request right now. Please try again.',
    'claim.sidebar.title': 'What happens next',
    'claim.sidebar.body': 'After verification, this website signs you in and attaches every invited ticket for this email to your Tikves account.',
    'claim.sidebar.pointOne': 'The verification code expires after a short time window.',
    'claim.sidebar.pointTwo': 'Active and cancelled tickets stay separated in the wallet.',
    'claim.sidebar.pointThree': 'You can later use password reset if you want mobile-app access too.',
    'tickets.kicker': 'Ticket wallet',
    'tickets.title': 'Your claimed tickets',
    'tickets.subtitle': 'This wallet only stays open for the current browser session.',
    'tickets.empty': 'No tickets are currently attached to this verified email.',
    'tickets.loading': 'Loading your tickets...',
    'tickets.active': 'Active tickets',
    'tickets.cancelled': 'Cancelled tickets',
    'tickets.sendToEmail': 'Send to email',
    'tickets.sendingToEmail': 'Sending...',
    'tickets.emailSent': 'Tickets for {event} were sent to {email}.',
    'tickets.emailFailed': 'Could not send tickets for {event}. Please try again.',
    'tickets.reference': 'Ticket reference',
    'tickets.assignment': 'Assignment',
    'tickets.status': 'Status',
    'tickets.cancelledBlurb': 'Cancelled tickets are preserved for reference and stay separate from active access.',
    'status.active': 'Active',
    'status.verified': 'Verified',
    'status.cancelled': 'Cancelled',
    'expired.title': 'Your session has expired.',
    'expired.body': 'Start the email verification flow again to reopen the ticket wallet in this browser.',
    'expired.action': 'Start a new claim'
  },
  mk: {
    'brand.title': 'Tikves Ticket Claim',
    'brand.subtitle': 'Безбедно веб-преземање за поканети гости',
    'nav.claim': 'Преземи',
    'nav.tickets': 'Билети',
    'nav.signOut': 'Одјави се',
    'claim.kicker': 'Портал за преземање билети',
    'claim.title': 'Преземете ги билетите од е-пошта без мобилната апликација.',
    'claim.description': 'Внесете ги податоците на примателот точно како што се наоѓаат во е-поштата со билетите. Ќе испратиме еднократен код за потврда пред билетите да бидат отклучени.',
    'claim.step.details': 'Податоци за примателот',
    'claim.step.verify': 'Потврда преку е-пошта',
    'claim.form.firstName': 'Име',
    'claim.form.lastName': 'Презиме',
    'claim.form.phone': 'Телефонски број',
    'claim.form.email': 'Е-пошта',
    'claim.form.code': 'Код за потврда',
    'claim.form.emailHint': 'Користете ја истата е-пошта што ја доби поканата.',
    'claim.form.phoneHint': 'По потврдата се зачувуваат само цифрите.',
    'claim.form.submit': 'Испрати код за потврда',
    'claim.form.verify': 'Потврди и отвори билети',
    'claim.form.back': 'Измени податоци',
    'claim.form.resend': 'Побарај нов код',
    'claim.form.resendWait': 'Повторно праќање за {seconds}s',
    'claim.form.sentHeadline': 'Проверете ја вашата е-пошта',
    'claim.form.sentBody': 'Шестцифрен код е испратен на {email}. Внесете го подолу за да го отклучите вашиот билетски паричник.',
    'claim.form.invalidCode': 'Кодот е невалиден или истечен. Побарајте нов код и обидете се повторно.',
    'claim.form.genericError': 'Барањето не може да се заврши во моментов. Обидете се повторно.',
    'claim.sidebar.title': 'Што следува',
    'claim.sidebar.body': 'По потврдата, оваа веб-страница ве најавува и ги врзува сите поканети билети за оваа е-пошта со вашата Tikves сметка.',
    'claim.sidebar.pointOne': 'Кодот за потврда истекува по краток временски период.',
    'claim.sidebar.pointTwo': 'Активните и откажаните билети се одвоени во паричникот.',
    'claim.sidebar.pointThree': 'Подоцна можете да користите ресетирање лозинка и за пристап во мобилната апликација.',
    'tickets.kicker': 'Билетски паричник',
    'tickets.title': 'Вашите преземени билети',
    'tickets.subtitle': 'Овој паричник останува отворен само за тековната сесија на прелистувачот.',
    'tickets.empty': 'Во моментов нема билети поврзани со оваа потврдена е-пошта.',
    'tickets.loading': 'Ги вчитуваме вашите билети...',
    'tickets.active': 'Активни билети',
    'tickets.cancelled': 'Откажани билети',
    'tickets.sendToEmail': 'Испрати на е-пошта',
    'tickets.sendingToEmail': 'Се испраќа...',
    'tickets.emailSent': 'Билетите за {event} се испратени на {email}.',
    'tickets.emailFailed': 'Билетите за {event} не можеа да се испратат. Обидете се повторно.',
    'tickets.reference': 'Референца',
    'tickets.assignment': 'Доделување',
    'tickets.status': 'Статус',
    'tickets.cancelledBlurb': 'Откажаните билети остануваат зачувани само за преглед и се одвоени од активниот пристап.',
    'status.active': 'Активен',
    'status.verified': 'Потврден',
    'status.cancelled': 'Откажан',
    'expired.title': 'Вашата сесија истече.',
    'expired.body': 'Започнете ја повторно потврдата преку е-пошта за да го отворите паричникот во овој прелистувач.',
    'expired.action': 'Започни ново преземање'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'tikves-claim-language';
  private readonly languageState = signal<Language>(this.detectInitialLanguage());

  readonly language = this.languageState.asReadonly();
  readonly locale = computed(() => (this.languageState() === 'mk' ? 'mk-MK' : 'en-US'));

  setLanguage(language: Language): void {
    this.languageState.set(language);
    localStorage.setItem(this.storageKey, language);
  }

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    let value = translations[this.languageState()][key];
    if (!params) {
      return value;
    }

    for (const [paramKey, paramValue] of Object.entries(params)) {
      value = value.replaceAll(`{${paramKey}}`, String(paramValue));
    }

    return value;
  }

  localize(text?: LocalizedText | string | null): string {
    if (!text) {
      return '';
    }

    if (typeof text === 'string') {
      return text;
    }

    return this.languageState() === 'mk' ? text.mk ?? text.en : text.en;
  }

  private detectInitialLanguage(): Language {
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'en' || stored === 'mk') {
      return stored;
    }

    return navigator.language.toLowerCase().startsWith('mk') ? 'mk' : 'en';
  }
}
