import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, catchError, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RequestComment {
  authorUpn: string;
  comment?: string;
  createdAt: string;
}

export interface Request {
  id?: string;
  title: string;
  description?: string;
  approverUpn?: string;
  requesterUpn?: string;
  type?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  comments?: RequestComment[];
}

export interface CreateRequestPayload {
  title: string;
  description?: string;
  approverUpn: string;
  requesterUpn: string;
  type: string;
}

export type HistoryAction = 'CREATE' | 'APPROVE' | 'REJECT' | 'COMMENT';

export interface HistoryItemApi {
  id: string;
  requestId: string;
  actorUpn: string;
  action: HistoryAction | string;
  comment?: string;
  occurredAt: string;
}

export interface HistoryItem {
  action: HistoryAction;
  by: string;
  comment?: string;
  when: string;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private base = `${environment.apiBaseUrl}/requests`;

  constructor(private http: HttpClient) { }

  list(params?: any): Observable<Request[]> {
    return this.http.get<Request[]>(this.base, { params });
  }

  listMine(requesterUpn: string, status?: string): Observable<Request[]> {
    const params: any = { requesterUpn };
    if (status) params.status = status;
    return this.http.get<Request[]>(this.base, { params });
  }

  listToApprove(approverUpn: string, status: string = 'PENDING'): Observable<Request[]> {
    return this.http.get<Request[]>(this.base, { params: { approverUpn, status } });
  }

  pendingApprovalsCount(approverUpn: string): Observable<number> {
    return this.listToApprove(approverUpn, 'PENDING').pipe(map(r => r.length));
  }

  get(id: string): Observable<Request> {
    return this.http.get<Request>(`${this.base}/${id}`);
  }

  create(body: CreateRequestPayload): Observable<Request> {
    return this.http.post<Request>(this.base, body);
  }

  approve(id: string, comment?: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/approve`, { comment });
  }

  reject(id: string, comment?: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/reject`, { comment });
  }

  history(id: string): Observable<HistoryItem[]> {
    return this.http.get<HistoryItemApi[]>(`${this.base}/${id}/history`).pipe(
      map(rows =>
        rows
          .map(r => ({
            action: (r.action as HistoryAction),
            by: r.actorUpn,
            comment: r.comment ?? '',
            when: r.occurredAt
          }))
          .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
      )
    );
  }

  private historyFromRequest(r: Request): HistoryItem[] {
    const items: HistoryItem[] = [];
    if (r.createdAt && r.requesterUpn) {
      items.push({ when: r.createdAt, action: 'CREATE', by: r.requesterUpn, comment: r.comments?.[0]?.comment });
    }
    (r.comments ?? []).forEach(c => {
      items.push({
        when: c.createdAt,
        action: this.normalizeAction('', c.comment),
        by: c.authorUpn,
        comment: c.comment
      });
    });
    return items.sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime());
  }

  private normalizeAction(action: string, comment?: string): HistoryAction {
    const a = (action || '').toUpperCase();
    if (a === 'APPROVE' || a === 'REJECT' || a === 'CREATE' || a === 'COMMENT') return a as HistoryAction;
    const txt = (comment || '').toLowerCase();
    if (txt.includes('aprob')) return 'APPROVE';
    if (txt.includes('rechaz') || txt.includes('reject') || txt.includes('cancel')) return 'REJECT';
    return 'COMMENT';
  }
}
