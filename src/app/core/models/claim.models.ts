export interface ClaimStartPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface ClaimVerifyPayload extends ClaimStartPayload {
  code: string;
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
