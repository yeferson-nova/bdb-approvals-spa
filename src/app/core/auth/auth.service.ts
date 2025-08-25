import { Injectable, Inject } from '@angular/core';
import { MSAL_INSTANCE, MsalBroadcastService } from '@azure/msal-angular';
import { IPublicClientApplication, AccountInfo, AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accountSubject = new BehaviorSubject<AccountInfo | null>(null);
  account$ = this.accountSubject.asObservable();

  constructor(@Inject(MSAL_INSTANCE) private msal: IPublicClientApplication, private broadcast: MsalBroadcastService) {
    console.log('[AuthService] ctor');
    this.emitCurrentAccount();
    this.broadcast.msalSubject$.subscribe((e: EventMessage) => {
      console.log('[AuthService] event', e.eventType);
      if (e.eventType === EventType.LOGIN_SUCCESS || e.eventType === EventType.ACQUIRE_TOKEN_SUCCESS || e.eventType === EventType.HANDLE_REDIRECT_END) {
        const res = e.payload as AuthenticationResult | undefined;
        if (res?.account) {
          this.msal.setActiveAccount(res.account);
          console.log('[AuthService] setActiveAccount', res.account.username);
        }
        this.emitCurrentAccount();
      }
      if (e.eventType === EventType.LOGOUT_SUCCESS) {
        console.log('[AuthService] logout success');
        this.accountSubject.next(null);
      }
    });
  }

  private emitCurrentAccount(): void {
    const acc = this.msal.getActiveAccount() ?? this.msal.getAllAccounts()[0] ?? null;
    if (acc) this.msal.setActiveAccount(acc);
    console.log('[AuthService] emitCurrentAccount', acc?.username);
    this.accountSubject.next(acc);
  }

  login(): void {
    console.log('[AuthService] login redirect');
    this.msal.loginRedirect({ scopes: environment.azureAd.apiScopes });
  }

  logout(): void {
    console.log('[AuthService] logout redirect');
    this.msal.logoutRedirect();
  }

  get account(): AccountInfo | null { return this.accountSubject.value; }

  get upn(): string | undefined { return this.account?.username; }
  get displayName(): string | undefined {
    const claims = (this.account?.idTokenClaims ?? {}) as any;
    return claims?.name || this.account?.username;
  }
  get email(): string | undefined {
    const claims = (this.account?.idTokenClaims ?? {}) as any;
    return claims?.preferred_username || this.account?.username;
  }

  async ensureApiConsent(): Promise<void> {
    const acc = this.account;
    if (!acc) return;
    try {
      const r = await this.msal.acquireTokenSilent({ account: acc, scopes: environment.azureAd.apiScopes });
      console.log('[AuthService] acquireTokenSilent ok', r.scopes);
    } catch (e) {
      console.log('[AuthService] acquireTokenSilent fail, redirect');
      await this.msal.acquireTokenRedirect({ account: acc, scopes: environment.azureAd.apiScopes });
    }
  }
}