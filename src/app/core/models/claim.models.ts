export interface ClaimStartPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventId?: string;
  acceptedTerms?: boolean;
  registrationAnswers?: ClaimRegistrationAnswer[];
}

export interface ClaimVerifyPayload extends ClaimStartPayload {
  code: string;
}

export interface ClaimRegistrationQuestion {
  key: string;
  label: string;
  type: 'text' | 'phone' | 'email' | 'dropdown' | 'checkbox' | 'consent' | 'number';
  required: boolean;
  helpText?: string | null;
  options?: string[];
  sortOrder?: number | null;
}

export interface ClaimRegistrationAnswer {
  key: string;
  value: string;
}

export interface ClaimRegistrationFormResponse {
  fields: ClaimRegistrationQuestion[];
  requiresTermsAcceptance?: boolean;
}

export interface ClaimAuthResponse {
  id: string;
  application: string;
  username: string;
  email: string;
  tenant: string;
  token: string;
  refresh: string;
  expiration: string;
  authorities: string[];
  ip?: string | null;
}
