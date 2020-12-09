import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { mockError, mockResponse, mockAuthUser } from '../../mock-data';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHttp: Partial<HttpClient>;
  let element: HTMLElement;
  let http: HttpClient;
  

  beforeEach(async(() => {
    mockHttp = {
      get: jasmine.createSpy('get').and.returnValues(of(mockResponse), throwError(mockError))
    }
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: HttpClient, useValue: mockHttp }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    http = fixture.debugElement.injector.get(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#click on public request btn should call #publicRequest', () => {
    spyOn(component, 'publicRequest').and.callFake(() => {});
    const click = new Event('click');
    const elBtn = element.querySelector('.public');
    // act
    elBtn.dispatchEvent(click);
    // assert
    expect(component.publicRequest).toHaveBeenCalled();
  });

  it('#click on admin request btn should call #adminRequest', () => {
    spyOn(component, 'adminRequest').and.callFake(() => {});
    const click = new Event('click');
    const elBtn = element.querySelector('.admin');
    // act
    elBtn.dispatchEvent(click);
    // assert
    expect(component.adminRequest).toHaveBeenCalled();
  });

  it('#click on user request btn should call #userRequest', () => {
    spyOn(component, 'userRequest').and.callFake(() => {});
    const click = new Event('click');
    const elBtn = element.querySelector('.user');
    // act
    elBtn.dispatchEvent(click);
    // assert
    expect(component.userRequest).toHaveBeenCalled();
  });

  it('should load message', () => {
    const msg = 'fake message';
    // act
    component.message.next(msg);
    fixture.detectChanges();
    const el = element.querySelector('.reponse-msg');
    // assert
    expect(el.textContent).toEqual(msg);
  });

  it('should not load message', () => {
    // act
    component.message.next(null);
    fixture.detectChanges();
    const el = element.querySelector('.reponse-msg');
    // assert
    expect(el).toBeNull();
  });

  it('should render correct static text values', () => {
    // arrange
    const pageTxt = 'This is the home page';
    const publicBtnTxt = 'Public request';
    const adminBtnTxt = 'Admin request';
    const userBtnTxt = 'User request';
    // grab elements
    const page = element.querySelector('p');
    const publicBtn = element.querySelector('.public');
    const adminBtn = element.querySelector('.admin');
    const userBtn = element.querySelector('.user');
    // assert for values
    expect(page.textContent).toEqual(pageTxt);
    expect(publicBtn.textContent).toEqual(publicBtnTxt);
    expect(adminBtn.textContent).toEqual(adminBtnTxt);
    expect(userBtn.textContent).toEqual(userBtnTxt);
  });

  it('#publicRequest should set success message', () => {
    // first call to publicRequest will set message to successful response
    component.publicRequest();
    // assert
    component.message.subscribe(
      res => {
        expect(res).toEqual(mockResponse.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#publicRequest should set error message', () => {
    // second call to publicRequest will set message to error response
    component.publicRequest();
    component.publicRequest();
    // assert
    component.message.subscribe(
      res => {
        expect(res).toEqual(mockError.error.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#adminRequest should set success message', () => {
    // first call to adminRequest will set message to successful response
    component.adminRequest();
    // assert
    component.message.subscribe(
      res => {
        expect(res).toEqual(mockResponse.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#adminRequest should set error message', () => {
    // second call to adminRequest will set message to error response
    component.adminRequest();
    component.adminRequest();
    // assert
    component.message.subscribe(
      res => {
        expect(res).toEqual(mockError.error.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#userRequest should set success message', () => {
    // first call to userRequest will set message to successful response
    component.userRequest();
    // assert
    component.message.subscribe(
      res => {
        expect(res).toEqual(mockResponse.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#userRequest should set error message', () => {
    // second call to userRequest will set message to error response
    component.userRequest();
    component.userRequest();
    // assert
    component.message.subscribe(
      res => {
        expect(res).toEqual(mockError.error.message);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#getUserId should return 0 with no user in storage', () => {
    // assure that no user is in storage
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    // act
    const result = component.getUserId();
    // assert
    expect(result).toBe(0);
  });

  it('#getUserId should return user id in localStorage', () => {
    // assure that no user is in sessionStorage
    sessionStorage.removeItem('user');
    // set user in localStorage
    localStorage.setItem('user', JSON.stringify(mockAuthUser));
    // act
    const result = component.getUserId();
    // assert
    expect(result).toBe(mockAuthUser.id);
    expect(mockAuthUser.id).not.toBe(0);
  });

  it('#getUserId should return user id in sessionStorage', () => {
    // assure that no user is in localStorage
    localStorage.removeItem('user');
    // set user in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(mockAuthUser));
    // act
    const result = component.getUserId();
    // assert
    expect(result).toBe(mockAuthUser.id);
    expect(mockAuthUser.id).not.toBe(0);
  });

});
