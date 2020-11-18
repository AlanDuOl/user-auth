import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { uiPath } from 'src/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.getAccessToken()
      .pipe(mergeMap(token => this.processRequestWithToken(token, req, next)));
  }

  // Checks if there is an access_token available in the authorize service
  // and adds it to the request in case it's targeted at the same origin as the
  // single page application.
  private processRequestWithToken(token: string, req: HttpRequest<any>, next: HttpHandler) {
    if (!!token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req).pipe(
      // redirect to login when token is invalid or user is unauthorized
      tap(
        () => { },
        (err: HttpErrorResponse) => {
          if (err.status === 401 && err.error.message === 'jwt expired') {
            this.auth.resetUser();
            this.router.navigate([uiPath.login]);
          }
          else if (err.status === 401) {
            this.router.navigate([uiPath.login]);
          }
        }
      )
    );
  }

}
