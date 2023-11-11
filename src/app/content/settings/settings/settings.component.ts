import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ProfileComponent, RouterOutlet, RouterLink, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  router = inject(Router);

  isActive(item: string): boolean {
    return this.router.url.includes(item);
  }
}
