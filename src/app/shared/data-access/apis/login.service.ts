import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { LoginUser, UserResponse } from 'src/app/shared/data-access/app.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  login(user: LoginUser) {
    return this.http.post<UserResponse>(this.apiUrl + 'users/login', { user }).pipe(
      map((res) => res.user),
      tap((user) => {
        localStorage.setItem('conduit-token', user.token);
      })
    );
  }
}
