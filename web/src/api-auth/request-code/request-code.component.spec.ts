import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
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
});
