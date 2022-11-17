import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResponse } from './app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCurrentUser() {
    return this.http.get<UserResponse>(this.apiUrl + 'user').pipe(map((res) => res.user));
  }
}
