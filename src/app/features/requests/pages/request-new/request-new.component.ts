// src/app/features/requests/pages/request-new/request-new.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RequestsService, CreateRequestPayload } from '../../services/requests.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-request-new',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './request-new.component.html',
  styleUrls: ['./request-new.component.scss']
})
export class RequestNewComponent {
  form: FormGroup;
  saving = false;

  constructor(private fb: NonNullableFormBuilder, private svc: RequestsService, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      approverUpn: ['', Validators.required],
      type: ['GENERIC', Validators.required]
    });
  }

  submit() {
    if (this.saving || this.form.invalid) return;
    if (!this.auth.upn) { this.auth.login(); return; }
    this.saving = true;
    const { title, description, approverUpn, type } = this.form.getRawValue();
    const payload: CreateRequestPayload = { title, description, approverUpn, type, requesterUpn: this.auth.upn! };
    this.svc.create(payload).subscribe({
      next: r => { const id = (r as any)?.id; if (id) this.router.navigate(['/requests', id]); else this.router.navigate(['/requests']); },
      error: err => { this.saving = false; alert(`No se pudo crear la solicitud. Código: ${err?.status ?? 'N/A'}`); }
    });
  }
}
