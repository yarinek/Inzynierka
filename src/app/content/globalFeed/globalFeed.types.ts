import { ArticleInterface } from '@app/shared/types/article.interface';

export interface GetFeedResponseInterface {
  articles: ArticleInterface[];
  articlesCount: number;
}

export interface FeedStateInterface {
  isLoading: boolean;
  error: string | null;
  data: GetFeedResponseInterface | null;
}
