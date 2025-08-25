export const environment = {
    production: false,
    apiBaseUrl: '/api',
    azureAd: {
        clientId: 'f5ea1d74-7c75-439c-aa50-f0700de21ca7',
        authority: 'https://login.microsoftonline.com/dfb9267a-7a99-404a-a689-24f99e34ef9b',
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200',
        apiScopes: [
            'api://63461b28-b43b-4b32-9174-712d545646f2/Requests.Read',
            'api://63461b28-b43b-4b32-9174-712d545646f2/Approvals.ReadWrite'
        ]
    }
};