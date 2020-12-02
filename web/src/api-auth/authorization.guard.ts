import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { uiPath } from 'src/constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isAuthorized('Admin').pipe(
      tap((isAuthorized: boolean) => this.handleAuthorization(isAuthorized))
    );
  }

  handleAuthorization(isAuthorized: boolean) {
    if (!isAuthorized) {
      this.router.navigate([uiPath.home]);
    }
  }
  
}
