import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { FeedBackType, LoginUser } from 'src/models';
import { AuthService } from '../auth.service';
import { DialogService } from '../dialog.service';
import { LoginComponent } from './login.component';
import { PageLoaderComponent } from '../../app/page-loader/page-loader.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;
  let mockDialog: Partial<DialogService>;
  let dialog: DialogService;

  beforeEach(async(() => {
    mockAuth = {
      requestVerificationEmail(): Observable<any> { return of(null) },
      login(): Promise<void> {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    }
    mockDialog = {
      confirmation(): Observable<boolean> { return of(false) }
    }
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        PageLoaderComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: DialogService, useValue: mockDialog },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    dialog = fixture.debugElement.injector.get(DialogService);
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#canDeactivate should emit true on form pristine', () => {
    // default behavior is form pristine
    const resultObservable = component.canDeactivate();
    // assert
    resultObservable.subscribe(
      res => {
        expect(component.form.pristine).toBe(true);
        expect(res).toBe(true);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#canDeactivate should emit true on valid form, startSubmit true and form not pristine', () => {
    // make form valid and not pristine
    component.form.get('email').setValue('abc@mail.com');
    component.form.get('password').setValue('abcdef');
    component.form.markAsDirty();
    // make strartSubmit true
    component.startSubmmit = true;
    // get observable
    const resultObservable = component.canDeactivate();
    // assert
    resultObservable.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it(`#canDeactivate should emit dialog result on invalid form or
    startSubmit false and form not pristine`, () => {
    // form is invalid as default
    // make form not pristine
    component.form.markAsDirty();
    // make strartSubmit true (if form is invalid, startSubmit value does not matter)
    component.startSubmmit = true;
    // dialog default return value is false
    // get observable
    let resultObservable = component.canDeactivate();
    // assert
    resultObservable.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(true).toBe(false);
      }
    );
    // change dialog return value
    spyOn(dialog, 'confirmation').and.returnValue(of(true));
    // get new observable
    resultObservable = component.canDeactivate();
    // assert for new value
    resultObservable.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#handleSubmit on valid form and #login resolve', fakeAsync(() => {
    const mockUser: LoginUser = {
      email: 'abc@mail.com',
      password: 'abcdef',
      keepLogged: false
    }
    // make #login async
    spyOn(auth, 'login').and.callFake(() => {
      return new Promise((resolve, reject) => {
        // promise will resolve after 1 second
        setTimeout(() => { resolve() }, 1000);
      })
    });
    // set form to valid
    component.form.get('email').setValue(mockUser.email);
    component.form.get('password').setValue(mockUser.password);
    // call method
    component.handleSubmit();
    // assert
    // #response should emit null
    component.response.subscribe(
      res => {
        expect(res).toBe(null);
      },
      () => {
        expect(false).toBe(true);
      }
    );
    // #isLoading should be true while #login does not resolve
    expect(component.isLoading).toBe(true);
    // should set startSubmit to true
    expect(component.startSubmmit).toBe(true);
    // should call #login with mockUser
    expect(auth.login).toHaveBeenCalledWith(mockUser);
    // resolve login promise
    tick(1000);
    // now #isLoading should be false
    expect(component.isLoading).toBe(false);
  }));

  it('#handleSubmit on valid form and #login reject', fakeAsync(() => {
    const mockUser: LoginUser = {
      email: 'abc@mail.com',
      password: 'abcdef',
      keepLogged: false
    }
    const mockError = {
      error: {
        message: 'test message',
        id: 1
      }
    }
    // make #login async
    spyOn(auth, 'login').and.callFake(() => {
      return new Promise((resolve, reject) => {
        // promise will resolve after 1 second
        setTimeout(() => { reject(mockError) }, 1000);
      })
    });
    // set form to valid
    component.form.get('email').setValue(mockUser.email);
    component.form.get('password').setValue(mockUser.password);
    // call method
    component.handleSubmit();
    // assert
    // #isLoading should be true while #login does not resolve
    expect(component.isLoading).toBe(true);
    // should set startSubmit to true
    expect(component.startSubmmit).toBe(true);
    // should call #login with mockUser
    expect(auth.login).toHaveBeenCalledWith(mockUser);
    // reject login promise
    tick(1000);
    // now #isLoading should be false
    expect(component.isLoading).toBe(false);
    // new #startSubmit should be false
    expect(component.startSubmmit).toBe(false);
    // now #response should emit mockError data
    component.response.subscribe(
      res => {
        expect(res.message).toBe(mockError.error.message);
        expect(res.id).toBe(mockError.error.id);
        expect(res.type).toBe(FeedBackType.error);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  }));

  it('#response emit correct value', fakeAsync(() => {
    const mockError = {
      error: {
        message: 'test message'
      }
    }
    // make #login promise reject
    spyOn(auth, 'login').and.callFake(() => {
      return new Promise((resolve, reject) => {
        reject(mockError);
      })
    });
    // set form to valid
    component.form.get('email').setValue('abc@mail.com');
    component.form.get('password').setValue('abcdef');
    // call method
    component.handleSubmit();
    // reject login promise
    tick();
    // #response should emit mockError data
    component.response.subscribe(
      res => {
        expect(res.message).toBe(mockError.error.message);
        expect(res.id).toBeNull();
        expect(res.type).toBe(FeedBackType.error);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  }));

  it('#handleSubmit should do nothing if form is invalid ', () => {
    // form is invalid as default
    component.handleSubmit();
    // assert values
    expect(component.isLoading).toBe(false);
    expect(component.startSubmmit).toBe(false);
  });

  it('#requestVerificationEmail should do nothing if id is invalid', () => {
    // call it invalid id
    component.requestVerificationEmail(null);
    // assert for default values
    expect(component.isLoading).toBe(false);
    expect(component.startSubmmit).toBe(false);
  });

  it('#requestVerificationEmail should set values on success', fakeAsync(() => {
    const fakeId = 1;
    const mockResponse = {
      message: 'mock message'
    }
    // make observable async
    spyOn(auth, 'requestVerificationEmail').and.returnValue(of(mockResponse).pipe(
      delay(500)
    ));
    // call method
    component.requestVerificationEmail(fakeId);
    // assert for values before async is complete
    expect(auth.requestVerificationEmail).toHaveBeenCalledWith(fakeId);
    expect(component.isLoading).toBe(true);
    // finish async
    tick(500);
    // assert for new values
    expect(component.isLoading).toBe(false);
    component.response.subscribe(
      res => {
        expect(res.message).toBe(mockResponse.message);
        expect(res.id).toBe(undefined);
        expect(res.type).toBe(FeedBackType.success);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  }));

  it('#requestVerificationEmail should set values on error', fakeAsync(() => {
    const fakeId = 1;
    const mockError = {
      error: {
        message: 'mock message'
      }
    }
    // make observable async
    spyOn(auth, 'requestVerificationEmail').and.returnValue(of({ val: 'fake' }).pipe(
      delay(500),
      tap(() => { throw mockError })
    ));
    // call method
    component.requestVerificationEmail(fakeId);
    // assert for values before async is complete
    expect(auth.requestVerificationEmail).toHaveBeenCalledWith(fakeId);
    expect(component.isLoading).toBe(true);
    // finish async
    tick(500);
    // assert for new values
    expect(component.isLoading).toBe(false);
    component.response.subscribe(
      res => {
        expect(res.message).toBe(mockError.error.message);
        expect(res.id).toBe(undefined);
        expect(res.type).toBe(FeedBackType.error);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  }));

  it('#isLoading true should not render component but loader', () => {
    // set #isLoading to true
    component.isLoading = true;
    // update template
    fixture.detectChanges();
    // grab elements from template
    const comp = document.querySelector('.app-login');
    const loader = document.querySelector('.loader-view');
    // assert
    expect(comp).toBeNull();
    expect(loader).not.toBeNull();
  });

  it('#isLoading false should render component but not loader', () => {
    // set #isLoading to true
    component.isLoading = false;
    // update template
    fixture.detectChanges();
    // grab elements from template
    const comp = document.querySelector('.app-login');
    const loader = document.querySelector('.loader-view');
    // assert
    expect(comp).not.toBeNull();
    expect(loader).toBeNull();
  });

  it('#response null should not load error container', () => {
    // response is null as default
    const container = document.querySelector('#error-container');
    // assert
    expect(container).toBeNull();
  });

  it('#response not null should show message in component', () => {
    // set response
    const mockMessage = 'test message';
    component.response.next({
      message: mockMessage,
      id: undefined,
      type: FeedBackType.success
    });
    // update view
    fixture.detectChanges();
    // grab updated element
    const msg = document.querySelector(`#msg-${FeedBackType.success}`);
    // assert
    expect(msg.textContent).toBe(mockMessage);
  });

  it('#response not null should show button if #id is valid', () => {
    let btn: HTMLElement;
    const btnText = 'Send verification email';
    // set response
    const mockMessage = 'test message';
    component.response.next({
      message: mockMessage,
      id: 1,
      type: FeedBackType.success
    });
    // update view
    fixture.detectChanges();
    // grab updated element
    // btn id should change with error type
    btn = document.querySelector('#validation-btn');
    // assert
    expect(btn.textContent.trim()).toBe(btnText);
  });

  it('#response not null should not show button if #id is invalid', () => {
    let btn: HTMLElement;
    const btnText = 'Send verification email';
    // set response
    const mockMessage = 'test message';
    component.response.next({
      message: mockMessage,
      id: undefined,
      type: FeedBackType.success
    });
    // update view
    fixture.detectChanges();
    // grab updated element
    // btn id should change with error type
    btn = document.querySelector('#validation-btn');
    // assert
    expect(btn).toBeNull();
  });

  it('#click on verification button should call #requestVerificationEmail with #id', () => {
    let btn: HTMLElement;
    const btnText = 'Send verification email';
    const click = new Event('click');
    // set response
    const mockMessage = 'test message';
    const mockId = 1;
    component.response.next({
      message: mockMessage,
      id: mockId,
      type: FeedBackType.success
    });
    spyOn(auth, 'requestVerificationEmail').and.returnValue(of({ message: 'fake message' }));
    // update view
    fixture.detectChanges();
    // grab updated element
    btn = document.querySelector('#validation-btn');
    // simulate click
    btn.dispatchEvent(click);
    // assert
    expect(auth.requestVerificationEmail).toHaveBeenCalledWith(mockId);
  });

  it('form submit should call #handleSubmit', () => {
    spyOn(component, 'handleSubmit').and.callThrough();
    // simulate a submit event
    fixture.debugElement.query(By.css('.form-login')).triggerEventHandler('ngSubmit', null);
    // assert for handleSubmit call
    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('email input should have a formControlName property', () => {
    const attrValue = 'email';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

  it('password input should have a formControlName property', () => {
    const attrValue = 'password';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

  it('keepLogged input should have a formControlName property', () => {
    const attrValue = 'keepLogged';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

  it('requestcode link should have a routerLink property', () => {
    const attrValue = '/requestcode';
    const el = document.querySelector(`a[routerLink="${attrValue}"]`);
    expect(el.getAttribute('routerLink')).toBe(attrValue);
  });

  it('register link should have a routerLink property', () => {
    const attrValue = '/register';
    const el = document.querySelector(`a[routerLink="${attrValue}"]`);
    expect(el.getAttribute('routerLink')).toBe(attrValue);
  });
  
});
