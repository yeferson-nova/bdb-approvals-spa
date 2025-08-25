import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestsService, Request, HistoryEntry } from '../../services/requests.service';

@Component({
  standalone: true,
  selector: 'app-request-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  id!: string;
  data?: Request;
  history: HistoryEntry[] = [];
  comment = '';
  loading = true;
  constructor(private route: ActivatedRoute, private svc: RequestsService) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.refresh();
  }
  refresh() {
    this.loading = true;
    this.svc.get(this.id).subscribe(r => { this.data = r; this.loading = false; });
    this.svc.history(this.id).subscribe(h => this.history = h);
  }
  approve() { this.svc.approve(this.id, this.comment).subscribe(() => this.refresh()); }
  reject() { this.svc.reject(this.id, this.comment).subscribe(() => this.refresh()); }
}