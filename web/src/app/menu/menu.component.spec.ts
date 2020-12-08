import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAuthMenuComponent } from '../../mock-data';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent,
        MockAuthMenuComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a routerLink to home page', () => {
    const text = 'Home';
    const selector = '/';
    const el = element.querySelector(`a[routerLink='${selector}']`);
    // assert
    expect(el.getAttribute('routerLink')).toEqual(selector);
    expect(el.textContent.trim()).toEqual(text);
  });

  it('should have a routerLink to user page', () => {
    const text = 'User';
    const selector = '/user';
    const el = element.querySelector(`a[routerLink='${selector}']`);
    // assert
    expect(el.getAttribute('routerLink')).toEqual(selector);
    expect(el.textContent.trim()).toEqual(text);
  });

  it('should have a routerLink to admin page', () => {
    const text = 'Admin';
    const selector = '/admin';
    const el = element.querySelector(`a[routerLink='${selector}']`);
    // assert
    expect(el.getAttribute('routerLink')).toEqual(selector);
    expect(el.textContent.trim()).toEqual(text);
  });

  it('should render app-auth-menu', () => {
    const el = element.querySelector('app-auth-menu');
    // assert
    expect(el).not.toBeNull();
  });

});
