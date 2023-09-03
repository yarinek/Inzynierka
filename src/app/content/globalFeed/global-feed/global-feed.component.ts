import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from '@app/shared/components/feed/feed.component';
import { BannerComponent } from '@app/shared/components/banner/banner.component';
import { PopularTagsComponent } from '@app/shared/components/popular-tags/popular-tags.component';
import { FeedTogglerComponent } from '@app/shared/components/feed-toggler/feed-toggler.component';

@Component({
  selector: 'app-global-feed',
  standalone: true,
  imports: [CommonModule, FeedComponent, BannerComponent, PopularTagsComponent, FeedTogglerComponent],
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss'],
})
export class GlobalFeedComponent {
  apiUrl = 'articles';
}
