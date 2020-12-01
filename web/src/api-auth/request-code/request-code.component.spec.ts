import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { uiPath } from 'src/constants';
import { AuthService } from '../auth.service';

import { RequestCodeComponent } from './request-code.component';

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
      declarations: [ RequestCodeComponent ],
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

  it('#requestCode should redirect to sendCode', fakeAsync(() => {
    // define expected param
    const expectedRoute = [`/${uiPath.sendCode}`];

    // make form control valid and call #requestCode
    component.form.get('email').setValue('alan@gmail.com');
    component.requestCode();
    tick();

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
  }));

  it('#requestCode should set message', fakeAsync(() => {
    // define return error
    const mockError = { error: { message: 'Error in request test' } };
    // make request return error
    spyOn(auth, 'requestResetCode').and.returnValue(throwError(mockError));

    // make form control valid and call #requestCode
    component.form.get('email').setValue('alan@gmail.com');
    component.requestCode();
    tick();

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
  }));

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

  it('#message not null should render error-text element', fakeAsync(() => {
    // arrenge
    const message = 'test message';
    let el: HTMLElement;
    // set message to null
    component.message.next(message);
    // update template
    fixture.detectChanges();
    tick();
    // search element in template
    el = document.querySelector('.error-text');
    // assert
    expect(el.textContent).toBe(message);
  }));

  it('#requestCode should not set #isLoading or make the request if form data is invalid', () => {
    // form is invalid as default
    // test if #isLoading is false before call #sendCode
    expect(component.isLoading).toBe(false);
    // call #sendCode
    component.requestCode();
    // #isLoading value won't change
    expect(component.isLoading).toBe(false);
  });

  it('#isLoading should be true while request does not complete', fakeAsync(() => {
    // make form control valid to allow #isLoading reasignment
    component.form.get('email').setValue('alan@abc.com');

    // #isLoading should be false before #sendCode is called
    expect(component.isLoading).toBe(false);

    // define async request
    spyOn(auth, 'requestResetCode').and.returnValue(of({ message: 'test request' }).pipe(
      tap(() => {
        // assert for #isLoading to be true before the request end
        expect(component.isLoading).toBe(true);
      }),
      // set request to wait 2 seconds to return
      delay(2000)
    ));
    // run delayed request
    component.requestCode();
    // simulate delay of 2 seconds
    tick(2000);
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
  
});
