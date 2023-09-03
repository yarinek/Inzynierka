import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetFeedResponseInterface } from './globalFeed.types';

@Injectable({
  providedIn: 'root',
})
export class GlobalFeedService {
  constructor(private http: HttpClient) {}

  getFeed(url: string): Observable<GetFeedResponseInterface> {
    return this.http.get<GetFeedResponseInterface>(url);
  }
}
