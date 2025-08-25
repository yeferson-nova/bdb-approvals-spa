import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Request {
  id?: string;
  title: string;
  description: string;
  approverUpn: string;
  requesterUpn: string;
  type: string;
  status?: string;
  createdAt?: string;
}
export interface HistoryEntry { when: string; action: string; by: string; comment?: string; }

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private base = `${environment.apiBaseUrl?.replace(/\/+$/, '')}/requests`;
  constructor(private http: HttpClient) { }

  list(status?: string): Observable<Request[]> {
    const params = status ? new HttpParams().set('status', status) : undefined as any;
    console.log('[HTTP] GET', this.base, { status });
    return this.http.get<Request[]>(this.base, { params });
  }
  get(id: string): Observable<Request> {
    console.log('[HTTP] GET', `${this.base}/${id}`);
    return this.http.get<Request>(`${this.base}/${id}`);
  }
  create(payload: Partial<Request>): Observable<Request> {
    console.log('[HTTP] POST', this.base, payload);
    return this.http.post<Request>(this.base, payload);
  }
  history(id: string): Observable<HistoryEntry[]> {
    console.log('[HTTP] GET', `${this.base}/${id}/history`);
    return this.http.get<HistoryEntry[]>(`${this.base}/${id}/history`);
  }
  approve(id: string, comment?: string) {
    console.log('[HTTP] POST', `${this.base}/${id}/approve`, { comment });
    return this.http.post<Request>(`${this.base}/${id}/approve`, { comment });
  }
  reject(id: string, comment?: string) {
    console.log('[HTTP] POST', `${this.base}/${id}/reject`, { comment });
    return this.http.post<Request>(`${this.base}/${id}/reject`, { comment });
  }
}