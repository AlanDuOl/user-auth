import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiPath, logoutStatus, uiPath } from '../constants';
import { LoginUser, AuthUser, User } from '../models';
import { Router } from '@angular/router';

interface IUser {
  name: string,
  roles: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<IUser | null> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map(u => !!u));
  }

  isAuthorized(requiredRole: string): Observable<boolean> {
    return this.user.pipe(take(1), map(user => this.checkRole(user, requiredRole)))
  }

  checkRole(user: IUser, requiredRole: string): boolean {
    // if user is valid, check if it has the required role
    if (!!user) {
      const result = user.roles.find(uRole => uRole === requiredRole);
      if (!!result) {
        return true;
      }
    }
    else {
      return false;
    }
  }

  getUser(): Observable<IUser> {
    return concat(
      // the take() operator completes the BehaviorSubject when user does not pass the filter
      this.user.pipe(take(1), filter(u => !!u)),
      this.getUserFromStorage().pipe(filter(u => !!u), tap(u => this.user.next(u))),
      this.user.asObservable()
    );
  }

  private getUserFromStorage(): Observable<AuthUser> {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      user = JSON.parse(sessionStorage.getItem('user'));
    }
    return of(user);
  }

  getAccessToken(): Observable<string> {
    return this.getUserFromStorage().pipe(map(user => user && user.token));
  }

  private authenticate(user: LoginUser): Observable<AuthUser> {
    return this.http.post<AuthUser>(apiPath.login, user);
  }

  login(user: LoginUser, keepLogged: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authenticate(user).subscribe(
        res => {
          // if user wants to stay logged, save it to localStorage
          // otherwise save it to sessionStorage
          if (keepLogged) {
            localStorage.setItem('user', JSON.stringify(res));
          }
          else {
            sessionStorage.setItem('user', JSON.stringify(res));
          }
          // set user
          this.user.next({ name: res.name, roles: res.roles });
          // redirect to home page
          this.router.navigate([`/${uiPath.home}`]);
          resolve();
        },
        err => {
          reject(err);
        }
      );
    });
  }

  logout(): Observable<string> {
    try {
      this.resetUser();
      return of(logoutStatus.success);
    }
    catch (err) {
      return of(logoutStatus.failure);
    }
  }

  resetUser(): void {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.user.next(null);
  }

  register(data: User): Observable<any> {
    return this.http.post<any>(apiPath.register, data);
  }

  sendVerification(token: string): Observable<any> {
    return this.http.get<any>(`${apiPath.verify}/${token}`);
  }

  requestVerificationEmail(userId: number): Observable<any> {
    return this.http.get<any>(`${apiPath.sendemail}/${userId}`);
  }

  requestResetCode(email: string): Observable<any> {
    return this.http.post<any>(`${apiPath.sendCode}`, { email });
  }

  sendResetCode(code: string): Observable<any> {
    return this.http.get<any>(`${apiPath.validateCode}/${code}`);
  }
}
