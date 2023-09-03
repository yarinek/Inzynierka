import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: '<div>{{message}}</div>',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() message = 'Something went wrong';
}
