import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from '@app/shared/components/feed/feed.component';
import { BannerComponent } from '@app/shared/components/banner/banner.component';
import { PopularTagsComponent } from '@app/shared/components/popular-tags/popular-tags.component';
import { FeedTogglerComponent } from '@app/shared/components/feed-toggler/feed-toggler.component';

@Component({
  selector: 'app-your-feed',
  standalone: true,
  imports: [CommonModule, FeedComponent, BannerComponent, PopularTagsComponent, FeedTogglerComponent],
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss'],
})
export class YourFeedComponent {
  public apiUrl = 'articles/feed';
}
