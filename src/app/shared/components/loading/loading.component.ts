import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: '<div>Loading...</div>',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {}
