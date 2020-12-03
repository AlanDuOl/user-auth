import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { IUser } from '../../models';
import { mockUser } from '../../mock-data';
import { AuthMenuComponent } from './auth-menu.component';

describe('AuthMenuComponent', () => {
  let component: AuthMenuComponent;
  let fixture: ComponentFixture<AuthMenuComponent>;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;


  beforeEach(async(() => {
    mockAuth = {
      isAuthenticated(): Observable<boolean> { return of(true) },
      getUser(): Observable<IUser> { return of(mockUser) }
    }
    TestBed.configureTestingModule({
      declarations: [AuthMenuComponent],
      providers: [
        { provide: AuthService, useValue: mockAuth },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMenuComponent);
    component = fixture.componentInstance;
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set #isAuthenticated and #userName 1', () => {
    // with default mock values isAuthenticated should be true
    // and userName should be 'test user'
    const expectedUserName = 'test user';
    // assert for default values
    component.isAutheticated.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        // this should not run
        expect(true).toBe(false);
      }
    );
    component.userName.subscribe(
      res => {
        expect(res).toBe(expectedUserName);
      },
      () => {
        // this should not run
        expect(true).toBe(false);
      }
    );
  });

  it('#ngOnInit should set #isAuthenticated and #userName 2', () => {
    // override auth methods to return new values
    spyOn(auth, 'isAuthenticated').and.returnValue(of(false));
    spyOn(auth, 'getUser').and.returnValue(of(null));
    // reset values on ngOnInit
    component.ngOnInit();
    // assert for new values
    component.isAutheticated.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        // this should not run
        expect(true).toBe(false);
      }
    );
    component.userName.subscribe(
      res => {
        expect(res).toBe(null);
      },
      () => {
        // this should not run
        expect(true).toBe(false);
      }
    );
  });

  it('#isAuthenticated true should not render login link but auth div', () => {
    // grab element in template
    let loginLink = document.querySelector('.login-link');
    let authInfo = document.querySelector('.auth-info');
    // assert
    expect(loginLink).toBeNull();
    expect(authInfo).not.toBeNull();
  });

  it('#isAuthenticated false should render login link and not auth div', () => {
    // override auth methods to return new values
    spyOn(auth, 'isAuthenticated').and.returnValue(of(false));
    // reset isAuthenticated
    component.ngOnInit();
    // update template with new data
    fixture.detectChanges();
    // grab element in template
    let loginLink = document.querySelector('.login-link');
    let authInfo = document.querySelector('.auth-info');
    // assert
    expect(loginLink).not.toBeNull();
    expect(authInfo).toBeNull();
  });

  it('login link should have a routerLink to /login', () => {
    const expectedPath = '/login';
    // override auth methods to return new values
    spyOn(auth, 'isAuthenticated').and.returnValue(of(false));
    // reset isAuthenticated
    component.ngOnInit();
    // update template with new data
    fixture.detectChanges();
    // grab element in template
    let loginLink = document.querySelector('.login-link');
    // assert
    expect(loginLink.getAttribute('routerLink')).toBe(expectedPath);
  });

  it('logout link should have a routerLink to /logout', () => {
    // default bahavior is isAuthenticated = true
    const expectedPath = '/logout';
    // grab element in template
    let logoutLink = document.querySelector('.logout-link');
    // assert
    expect(logoutLink.getAttribute('routerLink')).toBe(expectedPath);
  });

  it('user name span should have the expected user name', () => {
    // default bahavior is isAuthenticated = true
    const expectedUserName = 'Test User';
    // grab element in template
    let spanEl = document.querySelector('.user-name');
    // assert
    expect(spanEl.textContent).toContain(expectedUserName);
  });

});
