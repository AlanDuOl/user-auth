import { HttpErrorResponse, HttpEvent,
  HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { uiPath } from '../constants';


describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;
  let mockRouter: Partial<Router>;
  let router: Router;
  const mockToken = 'dkfj23fekjfkd24fsdfsdf/ffd';

  beforeEach(() => {
    mockAuth = {
      getAccessToken(): Observable<string> { return of(mockToken) },
      resetUser(): void { }
    }
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {})
    }
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuth }
      ]
    });
    interceptor = TestBed.inject(AuthInterceptor);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('#interceptor should send token in request', () => {
    const expectedHeaderValue = `Bearer ${mockToken}`;
    // create a fake request
    const request = new HttpRequest('GET', 'fakeurl');
    // create handler that returns a HttpResponse with the request headers
    const handler: HttpHandler = {
        handle(req): Observable<HttpEvent<any>> { 
          return of(new HttpResponse({
          headers: req.headers
        }));
      }
    };
    // get interceptor result
    const result = interceptor.intercept(request, handler);
    // assert for Authorization header
    result.subscribe(
      (res: HttpResponse<any>) => {
        const header = res.headers.get('Authorization');
        expect(header).toBe(expectedHeaderValue);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#interceptor should not send token in request', () => {
    // make access token invalid
    spyOn(auth, 'getAccessToken').and.returnValue(of(null));
    // create a fake request
    const request = new HttpRequest('GET', 'fakeurl');
    // create handler that returns a HttpResponse with request headers
    const handler: HttpHandler = {
        handle(req): Observable<HttpEvent<any>> { 
          return of(new HttpResponse({
          headers: req.headers
        }));
      }
    };
    // get interceptor result
    const result = interceptor.intercept(request, handler);
    // assert for Authorization header
    result.subscribe(
      (res: HttpResponse<any>) => {
        const header = res.headers.get('Authorization');
        expect(header).toBeNull();
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#interceptor should redirect to login and call resetUser', () => {
    spyOn(auth, 'resetUser').and.callThrough();
    const path = `/${uiPath.login}`;
    // create a fake request
    const request = new HttpRequest('GET', 'fakeurl');
    const errorResponse = new HttpErrorResponse({
      error: { message: 'jwt expired' },
      status: 401,
      statusText: 'Unauthorized',
    });
    // create handler that emits an HttpErrorResponse
    const handler: HttpHandler = {
        handle(req): Observable<HttpEvent<any>> { 
          return throwError(errorResponse);
        }
    }
    // get interceptor result
    const result = interceptor.intercept(request, handler);
    // assert
    result.subscribe(
      () => {
        expect(true).toBe(false);
      },
      (err: HttpErrorResponse) => {
        expect(err).toEqual(errorResponse);
        expect(router.navigate).toHaveBeenCalledWith([path]);
        expect(auth.resetUser).toHaveBeenCalled();
      }
    );
  });

  it('#interceptor should redirect to login', () => {
    spyOn(auth, 'resetUser').and.callThrough();
    const path = `/${uiPath.login}`;
    // create a fake request
    const request = new HttpRequest('GET', 'fakeurl');
    const errorResponse = new HttpErrorResponse({
      error: { message: 'error' },
      status: 401,
      statusText: 'Unauthorized',
    });
    // create handler that returns a HttpErrorResponse
    const handler: HttpHandler = {
        handle(req): Observable<HttpEvent<any>> { 
          return throwError(errorResponse);
        }
    }
    // get interceptor result
    const result = interceptor.intercept(request, handler);
    // assert
    result.subscribe(
      () => {
        expect(true).toBe(false);
      },
      (err: HttpErrorResponse) => {
        expect(err).toEqual(errorResponse);
        expect(router.navigate).toHaveBeenCalledWith([path]);
        expect(auth.resetUser).not.toHaveBeenCalled();
      }
    );
  });

});
