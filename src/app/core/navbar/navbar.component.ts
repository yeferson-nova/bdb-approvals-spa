import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(public auth: AuthService) { }
  get account$() { return this.auth.account$; }
  ngOnInit(): void {
    this.auth.account$.subscribe(a => console.log('[Navbar] account$', a?.username));
  }
  displayName(a: AccountInfo | null): string {
    const claims = (a?.idTokenClaims ?? {}) as any;
    return claims?.name || a?.username || '';
  }
  login() { console.log('[Navbar] login click'); this.auth.login(); }
  logout() { console.log('[Navbar] logout click'); this.auth.logout(); }
}