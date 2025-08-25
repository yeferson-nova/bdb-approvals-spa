// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { RequestsListComponent } from './features/requests/pages/requests-list/requests-list.component';
import { RequestNewComponent } from './features/requests/pages/request-new/request-new.component';
import { RequestDetailComponent } from './features/requests/pages/request-detail/request-detail.component';
import { ApprovalsListComponent } from './features/requests/pages/approvals-list/approvals-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'requests', pathMatch: 'full' },
    {
        path: 'requests',
        children: [
            { path: '', component: RequestsListComponent },
            { path: 'new', component: RequestNewComponent },
            { path: ':id', component: RequestDetailComponent },
        ]
    },
    { path: 'approvals', component: ApprovalsListComponent },
    { path: '**', redirectTo: 'requests' }
];
