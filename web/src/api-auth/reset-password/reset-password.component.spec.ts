import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { PageLoaderComponent } from '../../app/page-loader/page-loader.component';
import { mockRouteSnapshot } from '../../mock-data';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { uiPath } from 'src/constants';
import { delay, tap } from 'rxjs/operators';


describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;

  beforeEach(async(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {})
    }
    mockActivatedRoute = {
      snapshot: mockRouteSnapshot
    }
    mockAuth = {
      resetPassword: () => { return of({ message: 'Password changed' }) }
    }
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        ResetPasswordComponent,
        PageLoaderComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuth },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set #resetId on valid param', () => {
    // default behavior is a valid param
    expect(component.resetId).toBe(mockRouteSnapshot.paramMap.get('id'));
  });

  it('invalid id should redirect to home page', () => {
    const expectedRoute = [uiPath.home];
    // set id to invalid value
    component.resetId = null;
    // call ngOnInit
    component.ngOnInit();
    // should call navigate with route
    expect(router.navigate).toHaveBeenCalledWith(expectedRoute);
  });

  it('#resetPassword should do nothing if form data is not valid', () => {
    // form data is not valid at start
    expect(component.form.valid).toBe(false);
    // call #resetPassword
    component.resetPassword();
    // #isLoading should be false
    expect(component.isLoading).toBe(false);
  });

  it('#isLoading should be true while request does not complete', fakeAsync(() => {
    // set form data to valid and equal values
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');

    // #isLoading should be false before #sendCode is called
    expect(component.isLoading).toBe(false);

    // define async request
    spyOn(auth, 'resetPassword').and.returnValue(of({ message: 'test request' }).pipe(
      tap(() => {
        // assert for #isLoading to be true before the request end
        expect(component.isLoading).toBe(true)
      }),
      // set request to wait 2 seconds to return
      delay(2000)
    ));
    // run delayed request
    component.resetPassword();
    // simulate delay of 2 seconds
    tick(2000);
    // #isLoading should be false after the request completes
    expect(component.isLoading).toBe(false);
  }));

  it('should show error message message for different passwords', () => {
    const expectedMessage = 'Passwords are different';
    // set different passwords
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/4');
    // call resetPassword
    component.resetPassword();
    // assert for message value
    component.message.subscribe(
      res => {
        expect(res).toBe(expectedMessage);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#resetPassword should redirect to login', () => {
    const expectedRoute = [uiPath.login];
    // resetId is valid by default
    // set form data to valid and equal values
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');
    // call #resetPassword
    component.resetPassword();
    // assert for navigate call
    expect(router.navigate).toHaveBeenCalledWith(expectedRoute);
    expect(component.isLoading).toBe(false);
  });

  it('#resetPassword should show error message and set isLoading to false', () => {
    // set request to return error
    const mockError = { error: { message: 'Test error' } };
    spyOn(auth, 'resetPassword').and.returnValue(throwError(mockError));
    // resetId is valid by default
    // set form data to valid and equal values
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');
    // call #resetPassword
    component.resetPassword();
    // assert for error message
    component.message.subscribe(
      res => {
        expect(res).toBe(mockError.error.message);
        expect(component.isLoading).toBe(false);
      },
      () => {
        // this failed test is to asure that this code will not run
        expect(true).toBe(false);
      }
    )
  });

  it('#message should load in template', () => {
    let el: HTMLElement;
    const message = 'my test message';
    // set message
    component.message.next(message);
    fixture.detectChanges();
    // grab element
    el = document.querySelector('.error-text');
    expect(el.textContent).toBe(message);
  });

  it('#loader should load and component not', () => {
    // define elements
    let el: HTMLElement;
    let loader: HTMLElement;
    // set isLoading to true
    component.isLoading = true;
    fixture.detectChanges();
    // grab the elements
    el = document.querySelector('.view');
    loader = document.querySelector('.loader-view');
    // assert
    expect(el).toBeNull();
    expect(loader).not.toBeNull();
  });

  it('#loader should not load but component', () => {
    // define elements
    let el: HTMLElement;
    let loader: HTMLElement;
    // set isLoading to true
    component.isLoading = false;
    fixture.detectChanges();
    // grab the elements
    el = document.querySelector('.view');
    loader = document.querySelector('.loader-view');
    // assert
    expect(el).not.toBeNull();
    expect(loader).toBeNull();
  });
});
