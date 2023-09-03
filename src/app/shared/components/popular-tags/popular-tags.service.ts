import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PopularTagType } from '@app/shared/types/popularTag.type';

@Injectable({
  providedIn: 'root',
})
export class PopularTagsService {
  constructor(private http: HttpClient) {}

  getPopularTags(): Observable<PopularTagType[]> {
    return this.http.get<{ tags: PopularTagType[] }>('tags').pipe(map((r) => r.tags));
  }
}
