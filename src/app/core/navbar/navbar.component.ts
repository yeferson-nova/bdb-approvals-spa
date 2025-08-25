import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RequestsService } from '../../features/requests/services/requests.service';
import { AccountInfo } from '@azure/msal-browser';
import { Observable, of, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  account$!: Observable<AccountInfo | null>;
  approvalsCount$!: Observable<number>;

  constructor(public auth: AuthService, private requests: RequestsService) {
    this.account$ = this.auth.account$;
    this.approvalsCount$ = this.auth.account$.pipe(
      switchMap(a => a ? this.requests.pendingApprovalsCount(this.auth.upn || a.username) : of(0)),
      map(n => n || 0)
    );
  }

  displayName(a: AccountInfo | null): string {
    const claims = (a?.idTokenClaims ?? {}) as any;
    return claims?.name || a?.username || '';
  }

  login() { this.auth.login(); }
  logout() { this.auth.logout(); }
}
