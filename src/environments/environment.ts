const runtime = globalThis as { __tikvesClaimApiBaseUrl__?: string };

export const environment = {
  production: false,
  apiBaseUrl: runtime.__tikvesClaimApiBaseUrl__ ?? ''
};
