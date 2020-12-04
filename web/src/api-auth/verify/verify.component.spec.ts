import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { mockRouteSnapshot, mockRouteSnapshotFail } from '../../mock-data';
import { VerifyComponent } from './verify.component';
import { Observable, of, throwError } from 'rxjs';

describe('VerifyComponent', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let activatedRoute: ActivatedRoute;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;

  beforeEach(async(() => {
    mockActivatedRoute = {
      snapshot: mockRouteSnapshot
    }
    mockAuth = {
      sendVerification(): Observable<any> { return of({ message: 'Success message' }) }
    }
    TestBed.configureTestingModule({
      declarations: [ VerifyComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set success message', () => {
    // token is valid by default
    const message = 'inner test message';
    const token = activatedRoute.snapshot.queryParamMap.get('token');
    spyOn(auth, 'sendVerification').and.returnValue(of({ message }));
    // run #ngOnInit
    component.ngOnInit();
    // assert
    expect(auth.sendVerification).toHaveBeenCalledWith(token);
    component.message.subscribe(
      res => {
        expect(res).toBe(message);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#ngOnInit should set error message', () => {
    const mockError = {
      error: {
        message: 'Error message'
      }
    }
    // token is valid by default
    const token = activatedRoute.snapshot.queryParamMap.get('token');
    // make request return error
    spyOn(auth, 'sendVerification').and.returnValue(throwError(mockError));
    // run #ngOnInit
    component.ngOnInit();
    // assert
    expect(auth.sendVerification).toHaveBeenCalledWith(token);
    component.message.subscribe(
      res => {
        expect(res).toBe(mockError.error.message);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('invalid token should not call #sendVerification', () => {
    spyOn(auth, 'sendVerification').and.callThrough();
    // make token fail
    activatedRoute.snapshot = mockRouteSnapshotFail;
    // act
    component.ngOnInit();
    // assert
    expect(auth.sendVerification).not.toHaveBeenCalled();
  });

  it('message should not render in page', () => {
    // set message to null
    component.message.next(null);
    // update template
    fixture.detectChanges();
    // grab element
    const msg = document.querySelector('p');
    // assert
    expect(msg).toBe(null);
  })

  it('message should render in page', () => {
    const msg = 'test message form verify component';
    // set message
    component.message.next(msg);
    // update template
    fixture.detectChanges();
    // grab element
    const msgEl = document.querySelector('p');
    // assert
    expect(msgEl.textContent).toBe(msg);
  })

});
