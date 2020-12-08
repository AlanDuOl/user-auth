import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { uiPath } from 'src/constants';
import { AuthService } from './auth.service';

import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;
  let mockRouter: Partial<Router>;
  let router: Router;

  beforeEach(() => {
    mockAuth = {
      isAuthenticated(): Observable<boolean> { return of(true) }
    }
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {})
    }
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuth }
      ]
    });
    guard = TestBed.inject(AuthenticationGuard);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('#canActivate should emit true', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routeState: RouterStateSnapshot = {
      url: '',
      root: routeSnapshot
    };
    const result = guard.canActivate(routeSnapshot, routeState);
    // assert
    (result as Observable<boolean>).subscribe(
      res => {
        // emit true
        expect(res).toBe(true);
      },
      () => {
        expect(false).toBe(true);
      }
    );
    // navigate should not be called
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('#canActivate should emit false and call router navigate', () => {
    const path = `/${uiPath.login}`;
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routeState: RouterStateSnapshot = {
      url: '',
      root: routeSnapshot
    };
    // make isAuthenticated return false
    spyOn(auth, 'isAuthenticated').and.returnValue(of(false));
    // call canActivate with updated #isAuthenticated value
    const result = guard.canActivate(routeSnapshot, routeState);
    // assert
    (result as Observable<boolean>).subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(false).toBe(true);
      }
    );
    // navigate should be called
    expect(router.navigate).toHaveBeenCalledWith([path]);
  });

});
