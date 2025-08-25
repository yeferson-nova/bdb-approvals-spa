import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import {
  MsalModule, MsalService, MsalGuard, MsalBroadcastService,
  MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration, MsalInterceptorConfiguration, MsalInterceptor
} from '@azure/msal-angular';
import {
  IPublicClientApplication, PublicClientApplication,
  BrowserCacheLocation, InteractionType
} from '@azure/msal-browser';
import { environment } from './environments/environment';

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureAd.clientId,
      authority: environment.azureAd.authority,
      redirectUri: environment.azureAd.redirectUri,
      postLogoutRedirectUri: environment.azureAd.postLogoutRedirectUri
    },
    cache: { cacheLocation: BrowserCacheLocation.LocalStorage, storeAuthStateInCookie: false }
  });
}

function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect, authRequest: { scopes: environment.azureAd.apiScopes } };
}

function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const API_BASE = environment.apiBaseUrl.replace(/\/+$/, '');
  const protectedResourceMap = new Map<string, string[]>();
  protectedResourceMap.set(API_BASE, environment.azureAd.apiScopes);
  return { interactionType: InteractionType.Redirect, protectedResourceMap };
}

function initializeMsalAndHandleRedirect(instance: IPublicClientApplication) {
  return async () => {
    await instance.initialize();
    const result = await instance.handleRedirectPromise();

    if (result?.account) {
      instance.setActiveAccount(result.account);
    } else {
      const acc = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
      if (acc) {
        instance.setActiveAccount(acc);
      } else {
      }
    }
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(MsalModule),
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    { provide: APP_INITIALIZER, useFactory: initializeMsalAndHandleRedirect, deps: [MSAL_INSTANCE], multi: true },
    MsalService, MsalGuard, MsalBroadcastService
  ]
}).catch(e => console.error(e));