import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { PageLoaderComponent } from '../../app/page-loader/page-loader.component';
import { mockRouteSnapshot, mockRouteSnapshotFail } from '../../mock-data';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { uiPath } from 'src/constants';
import { delay, tap } from 'rxjs/operators';
import { By } from '@angular/platform-browser';


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
    // make snapshot return invalid id
    activatedRoute.snapshot = mockRouteSnapshotFail;
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

  it('#isLoading should be true while request does not complete (success)', fakeAsync(() => {
    // set form data to valid and equal values
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');

    // #isLoading should be false before #sendCode is called
    expect(component.isLoading).toBe(false);

    // define async request
    spyOn(auth, 'resetPassword').and.returnValue(of({ message: 'test request' }).pipe(
      // set request to wait 0.5 seconds to return
      delay(500)
    ));
    // run delayed request
    component.resetPassword();
    // assert for #isLoading to be true before the request end
    expect(component.isLoading).toBe(true)
    // simulate delay of 2 seconds
    tick(500);
    // #isLoading should be false after the request completes
    expect(component.isLoading).toBe(false);
  }));

  it('#isLoading should be true while request does not complete (error)', fakeAsync(() => {
    const mockError = {
      error: {
        message: 'Test message'
      }
    }
    // make form control valid to allow #isLoading reasignment
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');
    // define async request
    spyOn(auth, 'resetPassword').and.returnValue(of(mockError).pipe(
      delay(500),
      tap(err => { throw err })
    ));
    // run delayed request
    component.resetPassword();
    // #isLoading should be true before async completes
    expect(component.isLoading).toBe(true);
    // complete async
    tick(500);
    // #isLoading should be false after the request completes
    expect(component.isLoading).toBe(false);
  }));

  it('should show error message message for different passwords', () => {
    const expectedMessage = 'Passwords are different';
    // set valid form with different passwords
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

  it('#resetPassword should redirect to login on request success', () => {
    const expectedRoute = [uiPath.login];
    // resetId is valid by default
    // set form data to valid and equal values
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');
    // call #resetPassword
    component.resetPassword();
    // assert for navigate call
    expect(router.navigate).toHaveBeenCalledWith(expectedRoute);
  });

  it('#resetPassword should show error message on request error', () => {
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

  it('#message null should not render error-text element', fakeAsync(() => {
    // arrenge
    let el: HTMLElement;
    // set message to null
    component.message.next(null);
    // update template
    fixture.detectChanges();
    tick();
    // search element in template
    el = document.querySelector('.error-text');
    // assert
    expect(el).toBe(null);
  }));

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

  it('form submit should call #resetPassword', () => {
    spyOn(component, 'resetPassword').and.callThrough();
    // simulate a submit event
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    // assert for resetPassword call
    expect(component.resetPassword).toHaveBeenCalled();
  });

  it('password input should have a formControlName property', () => {
    const attrValue = 'password';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

  it('confirmPassword input should have a formControlName property', () => {
    const attrValue = 'confirmPassword';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

});
