import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { MockComponent } from '../../mock-data';


describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  // let mockRouter: Partial<Router>;
  // let router: Router;

  beforeEach(async(() => {
    // mockRouter = {
    //   navigate: jasmine.createSpy('navigate').and.callThrough()
    // }
    TestBed.configureTestingModule({
      imports: [
        // RouterModule.forRoot([
        //   { path: '/', component: ResetPasswordComponent },
        //   { path: '/test', component: MockComponent }
        // ])
      ],
      declarations: [
        ResetPasswordComponent,
      ],
      providers: [
        // { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('#sendCode should submit data to backend', () => {
  //   window.history.state
  // });
});
