import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RequestsService, Request } from '../../services/requests.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-requests-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit, OnDestroy {
  rows: Request[] = [];
  loading = false;
  isAuthed = false;
  sub?: Subscription;

  constructor(private svc: RequestsService, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    console.log('[RequestsList] ngOnInit');
    this.sub = this.auth.account$.subscribe(acc => {
      this.isAuthed = !!acc;
      console.log('[RequestsList] account$', acc?.username, 'isAuthed', this.isAuthed);
      if (this.isAuthed) this.load(); else { this.rows = []; this.loading = false; }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  private load() {
    this.loading = true;
    console.log('[RequestsList] load start');
    this.svc.list().subscribe({
      next: d => { this.rows = d; this.loading = false; console.log('[RequestsList] load ok', d.length); },
      error: e => { this.loading = false; console.error('[RequestsList] load error', e); }
    });
  }

  open(id: string) { console.log('[RequestsList] open', id); this.router.navigate(['/requests', id]); }
}