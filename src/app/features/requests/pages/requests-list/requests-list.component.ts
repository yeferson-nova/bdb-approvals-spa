import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RequestsService, Request } from '../../services/requests.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-requests-list',
  imports: [CommonModule, RouterModule, DatePipe, FormsModule],
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent {
  rows: Request[] = [];
  loading = false;
  isAuthed = false;
  q = '';

  constructor(private svc: RequestsService, private router: Router, public auth: AuthService) {
    this.auth.account$.subscribe(a => {
      this.isAuthed = !!a;
      if (a) this.load();
      else this.rows = [];
    });
  }

  get filtered(): Request[] {
    const text = this.q.trim().toLowerCase();
    if (!text) return this.rows;
    const terms = text.split(/\s+/).filter(Boolean);
    return this.rows.filter(r => {
      const hay = [
        r.title || '',
        r.status || '',
        r.approverUpn || ''
      ].join(' ').toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }

  load() {
    if (!this.auth.upn) return;
    this.loading = true;
    this.svc.listMine(this.auth.upn).subscribe({
      next: r => {
        const me = (this.auth.upn || '').toLowerCase();
        this.rows = (r || []).filter(x => (x.requesterUpn || '').toLowerCase() === me);
        this.loading = false;
      },
      error: _ => { this.rows = []; this.loading = false; }
    });
  }

  open(id: string) {
    this.router.navigate(['/requests', id]);
  }
}
