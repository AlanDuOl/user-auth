import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { uiPath } from 'src/constants';
import { AuthService } from '../auth.service';
import { PageLoaderComponent } from '../../app/page-loader/page-loader.component';
import { RequestCodeComponent } from './request-code.component';
import { By } from '@angular/platform-browser';

describe('RequestCodeComponent', () => {
  let component: RequestCodeComponent;
  let fixture: ComponentFixture<RequestCodeComponent>;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;

  beforeEach(async(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {})
    },
    mockAuth = {
      requestResetCode(): Observable<any> { return of({ message: 'Code sent' }) }
    }
    TestBed.configureTestingModule({
      declarations: [
        RequestCodeComponent,
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
    fixture = TestBed.createComponent(RequestCodeComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#requestCode should redirect to sendCode', () => {
    // define expected param
    const expectedRoute = [`/${uiPath.sendCode}`];

    // make form control valid and call #requestCode
    component.form.get('email').setValue('alan@gmail.com');
    component.requestCode();

    // assert for navigate call
    expect(router.navigate).toHaveBeenCalledWith(expectedRoute);
    // expect message to emit null
    component.message.asObservable().subscribe(
      res => {
        expect(res).toBeNull();
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#requestCode should set message', () => {
    // define return error
    const mockError = { error: { message: 'Error in request test' } };
    // make request return error
    spyOn(auth, 'requestResetCode').and.returnValue(throwError(mockError));

    // make form control valid and call #requestCode
    component.form.get('email').setValue('alan@gmail.com');
    component.requestCode();

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

  it('#requestCode should not set #isLoading or make the request if form data is invalid', () => {
    // form is invalid as default
    // test if #isLoading is false before call #sendCode
    expect(component.isLoading).toBe(false);
    // call #sendCode
    component.requestCode();
    // #isLoading value won't change
    expect(component.isLoading).toBe(false);
  });

  it('#isLoading should be true while request does not complete (success)', fakeAsync(() => {
    // make form control valid to allow #isLoading reasignment
    component.form.get('email').setValue('alan@abc.com');
    // #isLoading should be false before #sendCode is called
    expect(component.isLoading).toBe(false);
    // define async request
    spyOn(auth, 'requestResetCode').and.returnValue(of({ message: 'test request' }).pipe(
      // set request to wait 2 seconds to return
      delay(500)
    ));
    // run delayed request
    component.requestCode();
    // assert for #isLoading to be true before the request end
    expect(component.isLoading).toBe(true);
    // simulate delay of 0.5 seconds
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
    component.form.get('email').setValue('alan@abc.com');
    // define async request
    spyOn(auth, 'requestResetCode').and.returnValue(of(mockError).pipe(
      delay(500),
      tap(err => { throw err })
    ));
    // run delayed request
    component.requestCode();
    // #isLoading should be true before async completes
    expect(component.isLoading).toBe(true);
    // simulate delay of 2 seconds
    tick(500);
    // #isLoading should be false after the request completes
    expect(component.isLoading).toBe(false);
  }));

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
  
  it('email input should have a formControlName property', () => {
    const attrValue = 'email';
    const el = document.querySelector(`input[formControlName=${attrValue}]`);
    expect(el.getAttribute('formControlName')).toBe(attrValue);
  });

  it('form submit should call #requestCode', () => {
    spyOn(component, 'requestCode').and.callThrough();
    // simulate a submit event
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    // assert for requestCode call
    expect(component.requestCode).toHaveBeenCalled();
  });
});
