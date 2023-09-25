import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExampleInterface } from './example.types';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  constructor(private http: HttpClient) {}

  getExampleData(): Observable<ExampleInterface> {
    return this.http.get<ExampleInterface>('/example');
  }
}
