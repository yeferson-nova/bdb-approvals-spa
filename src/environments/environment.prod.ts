// src/environments/environment.ts
export const environment = {
    production: true,
    apiBaseUrl: 'http://<TASK_IP>:8080/api',
    azureAd: {
        tenantId: 'dfb9267a-7a99-404a-a689-24f99e34ef9b', // <-- tu tenant
        clientId: 'f5ea1d74-7c75-439c-aa50-f0700de21ca7', // <-- SPA clientId
        authority: 'https://login.microsoftonline.com/dfb9267a-7a99-404a-a689-24f99e34ef9b',
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200',
        cacheLocation: 'localStorage',
        // Scope expuesto por tu API (Expose an API): Approvals.ReadWrite
        apiScopes: ['api://63461b28-b43b-4b32-9174-712d545646f2/Approvals.ReadWrite']
    }
};
