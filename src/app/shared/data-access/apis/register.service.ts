import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { NewUser, UserResponse } from 'src/app/shared/data-access/app.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  register(user: NewUser) {
    return this.http.post<UserResponse>(this.apiUrl + 'users', { user }).pipe(
      map((res) => res.user),
      tap((user) => {
        localStorage.setItem('conduit-token', user.token);
      })
    );
  }
}
