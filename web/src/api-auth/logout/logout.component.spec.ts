import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let mockAuth: Partial<AuthService>;
  let auth: AuthService;

  beforeEach(async(() => {
    mockAuth = {
      logout(): Observable<string> { return of('test message') }
    }
    TestBed.configureTestingModule({
      declarations: [ LogoutComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuth }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set $message', () => {
    const msg = 'new test message';
    // define new return message
    spyOn(auth, 'logout').and.returnValue(of(msg));
    // update $message
    component.ngOnInit();
    // assert
    component.$message.subscribe(
      res => {
        expect(res).toBe(msg);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('$message null should not load template message', () => {
    // set $message to null
    component.$message = of(null);
    // update template
    fixture.detectChanges();
    // grab elements
    const el = document.querySelector('p');
    // assert
    expect(el.textContent).toBe('');
  });

  it('$message not null should be loaded in template template', () => {
    const msg = 'test message now';
    // set $message to null
    component.$message = of(msg);
    // update template
    fixture.detectChanges();
    // grab elements
    const el = document.querySelector('p');
    // assert
    expect(el.textContent).toBe(msg);
  });
  
});
