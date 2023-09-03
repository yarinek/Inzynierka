import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { feedActions } from '@app/content/globalFeed/store/actions';
import { combineLatest } from 'rxjs';
import { selectError, selectFeedData, selectIsLoading } from '@app/content/globalFeed/store/reducers';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import queryString from 'query-string';

import { ErrorMessageComponent } from '../error-message/error-message.component';
import { LoadingComponent } from '../loading/loading.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { TagListComponent } from '../tag-list/tag-list.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, ErrorMessageComponent, LoadingComponent, PaginationComponent, TagListComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, OnChanges {
  @Input() apiUrl = '';

  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public data$ = combineLatest({
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
    feed: this.store.select(selectFeedData),
  });

  limit = environment.limit;
  baseUrl = this.router.url.split('?')[0];
  currentPage = 0;

  ngOnInit(): void {
    this.store.dispatch(feedActions.getFeed({ url: this.apiUrl }));

    this.route.queryParams.subscribe((params: Params) => {
      this.currentPage = Number(params['page'] || '1');
      this.fetchFeed();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isApiUrlChanged =
      !changes['apiUrl'].firstChange && changes['apiUrl'].currentValue !== changes['apiUrl'].previousValue;
    if (isApiUrlChanged) {
      this.fetchFeed();
    }
  }

  fetchFeed(): void {
    const offset = this.currentPage * this.limit - this.limit;
    const parsedUrl = queryString.parseUrl(this.apiUrl);
    const stringifiedParams = queryString.stringify({
      limit: this.limit,
      offset,
      ...parsedUrl.query,
    });
    const apiUrlWithParams = `${parsedUrl.url}?${stringifiedParams}`;
    this.store.dispatch(feedActions.getFeed({ url: apiUrlWithParams }));
  }
}
