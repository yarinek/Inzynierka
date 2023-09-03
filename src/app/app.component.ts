import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoaderComponent } from './shared/components/loader/loader.component';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent, LoaderComponent],
})
export class AppComponent {}
