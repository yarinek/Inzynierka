import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopularTagType } from './../../types/popularTag.type';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent {
  @Input() tags: PopularTagType[] = [];
}
