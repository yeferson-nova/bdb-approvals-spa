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

    this.emitCurrentAccount();
    this.broadcast.msalSubject$.subscribe((e: EventMessage) => {

      if (e.eventType === EventType.LOGIN_SUCCESS || e.eventType === EventType.ACQUIRE_TOKEN_SUCCESS || e.eventType === EventType.HANDLE_REDIRECT_END) {
        const res = e.payload as AuthenticationResult | undefined;
        if (res?.account) {
          this.msal.setActiveAccount(res.account);
        }
        this.emitCurrentAccount();
      }
      if (e.eventType === EventType.LOGOUT_SUCCESS) {
        this.accountSubject.next(null);
      }
    });
  }

  private emitCurrentAccount(): void {
    const acc = this.msal.getActiveAccount() ?? this.msal.getAllAccounts()[0] ?? null;
    if (acc) this.msal.setActiveAccount(acc);

    this.accountSubject.next(acc);
  }

  login(): void {
    this.msal.loginRedirect({ scopes: environment.azureAd.apiScopes });
  }

  logout(): void {
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
    } catch (e) {
      await this.msal.acquireTokenRedirect({ account: acc, scopes: environment.azureAd.apiScopes });
    }
  }
}