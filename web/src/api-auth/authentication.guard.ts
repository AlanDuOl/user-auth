import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { uiPath } from 'src/constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isAuthenticated().pipe(
      tap((isAuthenticated: boolean) => this.handleAuthentication(isAuthenticated, state))
    );
  }

  handleAuthentication(isAuthenticated: boolean, state: RouterStateSnapshot): void {
    if (!isAuthenticated) {
      console.log('not authenticated', state);
      this.router.navigate([uiPath.login]);
    }
  }
  
}
