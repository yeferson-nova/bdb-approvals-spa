import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RequestsService, Request } from '../../services/requests.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-approvals-list',
    imports: [CommonModule, RouterModule, DatePipe],
    templateUrl: './approvals-list.component.html',
    styleUrls: ['./approvals-list.component.scss']
})
export class ApprovalsListComponent {
    rows: Request[] = [];
    loading = false;
    isAuthed = false;

    constructor(private svc: RequestsService, private router: Router, public auth: AuthService) {
        this.auth.account$.subscribe(a => {
            this.isAuthed = !!a;
            if (a) this.load();
            else this.rows = [];
        });
    }

    load() {
        if (!this.auth.upn) return;
        this.loading = true;
        this.svc.listToApprove(this.auth.upn, 'PENDING').subscribe({
            next: r => { this.rows = r || []; this.loading = false; },
            error: _ => { this.rows = []; this.loading = false; }
        });
    }

    open(id: string) {
        this.router.navigate(['/requests', id], { queryParams: { from: 'approvals' } });
    }
}
