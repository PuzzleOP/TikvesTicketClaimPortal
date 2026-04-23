const runtime = globalThis as { __tikvesClaimApiBaseUrl__?: string };

export const environment = {
  production: true,
  apiBaseUrl: runtime.__tikvesClaimApiBaseUrl__ ?? ''
};
