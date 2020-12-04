import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { uiPath } from 'src/constants';
import { AuthService } from '../auth.service';
import { DialogService } from '../dialog.service';
import { RegisterComponent } from './register.component';
import { PageLoaderComponent } from '../../app/page-loader/page-loader.component';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;
  let mockDialog: Partial<DialogService>;
  let dialog: DialogService;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockModal: Partial<NgbModal>;
  let modal: NgbModal;

  beforeEach(async(() => {
    mockAuth = {
      // async observable
      register(): Observable<any> { return of({}).pipe(
        delay(500)) 
      }
    }
    mockDialog = {
      confirmation(): Observable<boolean> { return of(false) }
    }
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {})
    }
    mockModal = {
      open: jasmine.createSpy('open').and.returnValues({
        result: new Promise((resolve, reject) => {
          resolve();
        })
      })
    }
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        PageLoaderComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: DialogService, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: NgbModal, useValue: mockModal },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    dialog = fixture.debugElement.injector.get(DialogService);
    router = fixture.debugElement.injector.get(Router);
    modal = fixture.debugElement.injector.get(NgbModal);
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
    component.form.get('name').setValue('lanlan');
    component.form.get('email').setValue('abc@mail.com');
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/3');
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

  it('#handleSubmit with invalid form should do nothing', () => {
    // form is invalid by default
    // call handleSubmit
    component.handleSubmit();
    // assert for change values
    expect(component.startSubmmit).toBe(false);
  });

  it('#handleSubmit with valid form and different passwords', () => {
    const msg = 'Passwords are different';
    // make form valid but with different passwords
    component.form.get('name').setValue('lanlan');
    component.form.get('email').setValue('abc@mail.com');
    component.form.get('password').setValue('Ab12/3');
    component.form.get('confirmPassword').setValue('Ab12/4');

    // call #handleSubmit
    component.handleSubmit();

    // assert for changes
    expect(component.startSubmmit).toBe(false);
    component.message$.subscribe(
      res => {
        expect(res).toBe(msg);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#handleSubmit with valid form and modal resolve', fakeAsync(() => {
    const path = `/${uiPath.login}`;
    const mockUser = {
      name: 'lanlan',
      email: 'abc@mail.com',
      password: 'Ab12/3',
      confirmPassword: 'Ab12/3',
    }
    // make form valid
    component.form.get('name').setValue(mockUser.name);
    component.form.get('email').setValue(mockUser.email);
    component.form.get('password').setValue(mockUser.password);
    component.form.get('confirmPassword').setValue(mockUser.confirmPassword);
    // make spy to track call
    spyOn(auth, 'register').and.callThrough();
    // call #handleSubmit
    component.handleSubmit();
    // assert before async resolve
    expect(component.startSubmmit).toBe(true);
    expect(component.pageLoading).toBe(true);
    expect(auth.register).toHaveBeenCalledWith(mockUser);
    // resolve async
    tick(500);
    // assert for changes
    expect(component.pageLoading).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([path]);
  }));

  it('#handleSubmit with valid form and request error', fakeAsync(() => {
    const path = `/${uiPath.login}`;
    const mockError = {
      error: {
        message: 'Test message'
      }
    }
    const mockUser = {
      name: 'lanlan',
      email: 'abc@mail.com',
      password: 'Ab12/3',
      confirmPassword: 'Ab12/3',
    }
    // make form valid
    component.form.get('name').setValue(mockUser.name);
    component.form.get('email').setValue(mockUser.email);
    component.form.get('password').setValue(mockUser.password);
    component.form.get('confirmPassword').setValue(mockUser.confirmPassword);
    // make #register request throw error
    spyOn(auth, 'register').and.returnValue(of({ val: 'fake' }).pipe(
      delay(500),
      tap(() => { throw mockError })
    ));
    // call #handleSubmit
    component.handleSubmit();
    // assert before async resolve
    expect(component.startSubmmit).toBe(true);
    expect(component.pageLoading).toBe(true);
    expect(auth.register).toHaveBeenCalledWith(mockUser);
    // resolve async
    tick(500);
    // assert for changes
    expect(component.startSubmmit).toBe(false);
    expect(component.pageLoading).toBe(false);
    component.message$.subscribe(
      res => {
        expect(res).toBe(mockError.error.message);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  }));
  
  it('#pageLoading true should not render component but loader', () => {
    // set #isLoading to true
    component.pageLoading = true;
    // update template
    fixture.detectChanges();
    // grab elements from template
    const comp = document.querySelector('.auth-register');
    const loader = document.querySelector('.loader-view');
    // assert
    expect(comp).toBeNull();
    expect(loader).not.toBeNull();
  });

  it('#pageLoading false should render component but not loader', () => {
    // set #isLoading to true
    component.pageLoading = false;
    // update template
    fixture.detectChanges();
    // grab elements from template
    const comp = document.querySelector('.auth-register');
    const loader = document.querySelector('.loader-view');
    // assert
    expect(comp).not.toBeNull();
    expect(loader).toBeNull();
  });

  it('#message$ not null should show message in component', () => {
    // set response
    const mockMessage = 'test message';
    component.message$.next(mockMessage);
    // update view
    fixture.detectChanges();
    // grab updated element
    const msg = document.querySelector('#error');
    // assert
    expect(msg.textContent).toBe(mockMessage);
  });

  it('form submit should call #handleSubmit', () => {
    spyOn(component, 'handleSubmit').and.callThrough();
    // simulate a submit event
    fixture.debugElement.query(By.css('.form-register')).triggerEventHandler('ngSubmit', null);
    // assert for handleSubmit call
    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('name input should have a formControlName property', () => {
    const attrValue = 'name';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
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

  it('confirmPassword input should have a formControlName property', () => {
    const attrValue = 'confirmPassword';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

});
