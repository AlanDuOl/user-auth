import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private auth: AuthService) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isAuthorized('Admin').pipe(
      tap((isAuthorized: boolean) => this.handleAuthorization(isAuthorized))
    );
  }

  handleAuthorization(isAuthorized: boolean) {
    if (isAuthorized) {
      console.log('isAuthorized');
    }
    else {
      console.log('not Authorized');
    }
  }
  
}
