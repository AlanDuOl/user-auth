import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FooterComponent } from '../app/footer/footer.component';
import { MenuComponent } from '../app/menu/menu.component';
import { MockAuthMenuComponent } from '../mock-data';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        MenuComponent,
        MockAuthMenuComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'user-auth'`, () => {
    expect(component.title).toEqual('user-auth');
  });

  it('should render app-menu', () => {
    const menu = element.querySelector('app-menu');
    // assert
    expect(menu).not.toBeNull();
  });

  it('should render router-outlet', () => {
    const routerOutlet = element.querySelector('router-outlet');
    // assert
    expect(routerOutlet).not.toBeNull();
  });
});
