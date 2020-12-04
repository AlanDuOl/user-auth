import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthUser, LoginUser } from 'src/models';
import { AuthService } from './auth.service';
import { mockAuthUser } from '../mock-data';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockHttp: Partial<HttpClient>;
  let http: HttpClient;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {})
    }
    mockHttp = {
      post: jasmine.createSpy('post').and.returnValues(of(mockAuthUser), throwError({
        error: { message: 'error message'}
      }))
    }
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HttpClient, useValue: mockHttp },
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#isAuthenticate should emit true', fakeAsync(() => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    // authenticate user
    service.login(mockUser);
    // resolve promise
    tick();
    // get observable
    const resultObservable = service.isAuthenticated();
    // assert
    resultObservable.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(false).toBe(true);
      }
    )
  }));
});
