import { combineLatest } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';

import { getPopularTagsAction } from './store/actions';
import { selectError, selectIsLoading, selectPopularTagsData } from './store/reducers';
import { LoadingComponent } from '../loading/loading.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-popular-tags',
  standalone: true,
  imports: [CommonModule, LoadingComponent, ErrorMessageComponent, RouterLink],
  templateUrl: './popular-tags.component.html',
  styleUrls: ['./popular-tags.component.scss'],
})
export class PopularTagsComponent implements OnInit {
  private store = inject(Store);
  data$ = combineLatest({
    popularTags: this.store.select(selectPopularTagsData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
  });

  ngOnInit(): void {
    this.store.dispatch(getPopularTagsAction.getPopularTags());
  }
}
