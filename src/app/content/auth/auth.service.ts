import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CurrentUserInterface } from '@app/shared/types/currentUser.interface';

import { AuthResponseInterface, LoginRequest, RegisterRequest } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    return this.http.get<AuthResponseInterface>('user').pipe(map((r) => this.getUser(r)));
  }

  register(data: RegisterRequest): Observable<CurrentUserInterface> {
    return this.http.post<AuthResponseInterface>('users', data).pipe(map((r) => this.getUser(r)));
  }

  login(data: LoginRequest): Observable<CurrentUserInterface> {
    return this.http.post<AuthResponseInterface>('users/login', data).pipe(map((r) => this.getUser(r)));
  }

  private getUser(response: AuthResponseInterface): CurrentUserInterface {
    return response.user;
  }
}
