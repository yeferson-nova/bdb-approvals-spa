import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestsService, HistoryItem } from '../../services/requests.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-request-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent {
  id!: string;
  from: string | null = null;
  data: any;
  history: HistoryItem[] = [];
  loading = false;
  comment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: RequestsService,
    public auth: AuthService
  ) {
    this.route.paramMap.subscribe(pm => {
      this.id = pm.get('id')!;
      this.refresh();
    });
    this.route.queryParamMap.subscribe(q => {
      this.from = q.get('from');
    });
  }

  get isApprover(): boolean {
    const me = (this.auth.upn || '').toLowerCase();
    const approver = (this.data?.approverUpn || '').toLowerCase();
    return !!me && me === approver;
  }

  get showActions(): boolean {
    return this.from === 'approvals' && this.isApprover && this.data?.status === 'PENDING';
  }

  refresh() {
    this.loading = true;
    this.svc.get(this.id).subscribe(r => { this.data = r; this.loading = false; });
    this.svc.history(this.id).subscribe(h => this.history = h);
  }

  approve() { this.svc.approve(this.id, this.comment).subscribe(() => this.refresh()); }
  reject() { this.svc.reject(this.id, this.comment).subscribe(() => this.refresh()); }

  back() {
    this.router.navigate([this.from === 'approvals' ? '/approvals' : '/requests']);
  }
  badgeAction(a: 'CREATE' | 'APPROVE' | 'REJECT' | 'COMMENT'): string {
    if (a === 'APPROVE') return 'approved';
    if (a === 'REJECT') return 'rejected';
    return 'pending';
  }

}
