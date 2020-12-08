import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { uiPath } from 'src/constants';
import { AuthService } from './auth.service';

import { AuthorizationGuard } from './authorization.guard';

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;
  let mockRouter: Partial<Router>;
  let router: Router;
  const mockRole = 'Admin';

  beforeEach(() => {
    mockAuth = {
      isAuthorized(): Observable<boolean> { return of(true) }
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
    guard = TestBed.inject(AuthorizationGuard);
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
    const path = uiPath.home;
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routeState: RouterStateSnapshot = {
      url: '',
      root: routeSnapshot
    };
    // make #isAuthorized return false
    spyOn(auth, 'isAuthorized').and.returnValue(of(false));
    // call canActivate with updated #isAuthorized value
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
