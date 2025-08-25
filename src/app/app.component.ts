import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MsalModule } from '@azure/msal-angular';
import { NavbarComponent } from './core/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, MsalModule, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent { }
