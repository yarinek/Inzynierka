import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '@app/core/utils.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() total = 0;
  @Input() limit = 20;
  @Input() currentPage = 1;
  @Input() url = '';

  private utilsService = inject(UtilsService);

  pagesCount = 1;
  pages: number[] = [];

  ngOnInit(): void {
    this.pagesCount = Math.ceil(this.total / this.limit);
    this.pages = this.pagesCount > 0 ? this.utilsService.range(1, this.pagesCount) : [];
  }
}
