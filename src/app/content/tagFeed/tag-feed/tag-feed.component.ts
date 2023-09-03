import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from '@app/shared/components/feed/feed.component';
import { BannerComponent } from '@app/shared/components/banner/banner.component';
import { PopularTagsComponent } from '@app/shared/components/popular-tags/popular-tags.component';
import { FeedTogglerComponent } from '@app/shared/components/feed-toggler/feed-toggler.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-tag-feed',
  standalone: true,
  imports: [CommonModule, FeedComponent, BannerComponent, PopularTagsComponent, FeedTogglerComponent],
  templateUrl: './tag-feed.component.html',
  styleUrls: ['./tag-feed.component.scss'],
})
export class TagFeedComponent implements OnInit {
  apiUrl = '';
  tagName = '';

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.tagName = params['slug'] as string;
      this.apiUrl = `/articles?tag=${this.tagName}`;
    });
  }
}
