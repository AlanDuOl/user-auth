import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { uiPath } from 'src/constants';
import { AuthService } from '../auth.service';
import { SendCodeComponent } from './send-code.component';
import { PageLoaderComponent } from '../../app/page-loader/page-loader.component';
import { By } from '@angular/platform-browser';


describe('SendCodeComponent', () => {
  let component: SendCodeComponent;
  let fixture: ComponentFixture<SendCodeComponent>;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;

  beforeEach(async(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => { })
    },
    mockAuth = {
      sendResetCode(): Observable<any> { return of({ message: 'Code validated', id: 22 }) }
    }
    TestBed.configureTestingModule({
      declarations: [
        SendCodeComponent,
        PageLoaderComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuth },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCodeComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#sendCode should not set isLoading and make the request if form data is invalid', () => {
    // form is invalid as default
    spyOn(auth, 'sendResetCode').and.callThrough();
    // test if #isLoading is false before call #sendCode
    expect(component.isLoading).toBe(false);
    // call #sendCode
    component.sendCode();
    // #isLoading value won't change
    expect(component.isLoading).toBe(false);
    // #sendResetCode won't be called
    expect(auth.sendResetCode).not.toHaveBeenCalled();
  });

  it('#sendCode should redirect to resetPassword on request success', () => {
    // #sendResetCode request is successful by default
    // define expected param
    const expectedRoute = [`/${uiPath.resetPassword}`, { id: 22 }];
    // make form control valid
    component.form.get('code').setValue('aeid238sdsjas212');
    // call #sendCode
    component.sendCode();
    // assert for navigate call
    expect(router.navigate).toHaveBeenCalledWith(expectedRoute);
  });

  it('#sendCode should set message on request error', () => {
    // define return error
    const mockError = { error: { message: 'Error in request test' } };
    // make request return error
    spyOn(auth, 'sendResetCode').and.returnValue(throwError(mockError));
    // make form control valid and call #sendCode
    component.form.get('code').setValue('aeid238sdsjas212');
    component.sendCode();
    // assert message result to equal the error message in mockError
    component.message.asObservable().subscribe(
      res => {
        expect(res).toBe(mockError.error.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('#isLoading should be true while request does not complete (error)', fakeAsync(() => {
    const mockError = {
      error: {
        message: 'Test message'
      }
    }
    // make form control valid to allow #isLoading reasignment
    component.form.get('code').setValue('aeid238sdsjas212');
    // define async request
    spyOn(auth, 'sendResetCode').and.returnValue(of(mockError).pipe(
      // make request wait 0.5 seconds to emit error
      delay(500),
      tap(err => { throw err })
    ));
    // run delayed request
    component.sendCode();
    // assert for #isLoading to be true before the request end
    expect(component.isLoading).toBe(true)
    // complete delayed request
    tick(500);
    // #isLoading should be false after the request completes
    expect(component.isLoading).toBe(false);
  }));

  it('#isLoading should be true while request does not complete (success)', fakeAsync(() => {
    // make form control valid to allow #isLoading reasignment
    component.form.get('code').setValue('aeid238sdsjas212');
    // define async request
    spyOn(auth, 'sendResetCode').and.returnValue(of({ message: 'test request' }).pipe(
      // delay to emit value
      delay(500)
    ));
    // run delayed request
    component.sendCode();
    // assert for #isLoading to be true before the request end
    expect(component.isLoading).toBe(true)
    // complete async request
    tick(500);
    // #isLoading should be false after the request completes
    expect(component.isLoading).toBe(false);
  }));

  it('#message null should not render error-text element', () => {
    // arrenge
    let el: HTMLElement;
    // set message to null
    component.message.next(null);
    // update template
    fixture.detectChanges();
    // search element in template
    el = document.querySelector('.error-text');
    // assert
    expect(el).toBe(null);
  });

  it('#message not null should render error-text element', () => {
    // arrenge
    const message = 'test message';
    let el: HTMLElement;
    // set message to null
    component.message.next(message);
    // update template
    fixture.detectChanges();
    // search element in template
    el = document.querySelector('.error-text');
    // assert
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

  it('form submit should call #sendCode', () => {
    spyOn(component, 'sendCode').and.callThrough();
    // simulate a submit event
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    // assert for sendCode call
    expect(component.sendCode).toHaveBeenCalled();
  });

  it('code input should have a formControlName property', () => {
    const attrValue = 'code';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

});
