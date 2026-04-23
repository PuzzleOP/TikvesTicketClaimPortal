import { Routes } from '@angular/router';

import { sessionGuard } from './core/guards/session.guard';
import { ClaimPageComponent } from './pages/claim-page.component';
import { ExpiredPageComponent } from './pages/expired-page.component';
import { TicketsPageComponent } from './pages/tickets-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'claim' },
  { path: 'claim', component: ClaimPageComponent },
  { path: 'tickets', component: TicketsPageComponent, canActivate: [sessionGuard] },
  { path: 'expired', component: ExpiredPageComponent },
  { path: '**', redirectTo: 'claim' }
];
