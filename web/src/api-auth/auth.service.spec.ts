import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthUser, IUser, LoginUser, ResetPassword, User } from 'src/models';
import { AuthService } from './auth.service';
import { mockAuthUser, mockError } from '../mock-data';
import { apiPath, logoutStatus, uiPath } from 'src/constants';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockHttp: Partial<HttpClient>;
  let http: HttpClient;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => { })
    }
    mockHttp = {
      post: jasmine.createSpy('post').and.returnValues(of(mockAuthUser), throwError(mockError)),
      get: jasmine.createSpy('get').and.returnValue(of({ message: 'request complete' }))
    }
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HttpClient, useValue: mockHttp },
      ]
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#isAuthenticate should emit true on successful login', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    // authenticate user
    service.login(mockUser);
    // resolve promise
    // get observable
    const resultObservable = service.isAuthenticated();
    // assert
    resultObservable.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(false).toBe(true);
      }
    )
  });

  it('#isAuthenticate should emit false on login fail', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    // authenticate user (first call is success)
    service.login(mockUser).catch(err => {
      expect(err).toBe(mockError);
    });;
    // remove user
    service.resetUser();
    // authenticate user (second call is error)
    service.login(mockUser)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch(err => {
        expect(err).toBe(mockError);
      });
    // get observable
    const resultObservable = service.isAuthenticated();
    // assert
    resultObservable.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#isAuthenticate should emit false by default', () => {
    // reset user because if other tests that perform login happen before a user will be stored
    // in browser storage
    service.resetUser();
    // get observable
    const resultObservable = service.isAuthenticated();
    // assert
    resultObservable.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#isAuthorized should emit true when logged user has role', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    const requiredRole = 'User';
    // log user
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // return role check (user role is Admin)
    const result = service.isAuthorized(requiredRole);
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(true);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#isAuthorized should emit false when logged user has not role', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    const requiredRole = 'Admin';
    // log user
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // return role check (user role is 'Admin')
    const result = service.isAuthorized(requiredRole);
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#isAuthorized should emit false with no user logged', () => {
    // logout any user
    service.resetUser();
    const requiredRole = 'Admin';
    // return role check (user role is 'Admin')
    const result = service.isAuthorized(requiredRole);
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(false);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#getUser should return logged user', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    const mockIUser: IUser = {
      name: mockAuthUser.name,
      roles: mockAuthUser.roles
    }
    // log user
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // get user
    const result = service.getUser();
    // assert
    result.subscribe(
      res => {
        expect(res.name).toEqual(mockIUser.name);
        expect(res.roles).toEqual(mockIUser.roles);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#getUser should return null', () => {
    // no user logged
    service.resetUser();
    // get user
    const result = service.getUser();
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(null);
      },
      () => {
        expect(false).toBe(true);
      }
    );
  });

  it('#getAccessToken should return token', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    // log user
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // get token
    const result = service.getAccessToken();
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(mockAuthUser.token);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#getAccessToken should return null', () => {
    // remove any user
    service.resetUser();
    // get token
    const result = service.getAccessToken();
    // assert
    result.subscribe(
      res => {
        expect(res).toBe(null);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#login should set user, sessionStorage and navigate', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    const path = `/${uiPath.home}`;
    // clear user
    service.resetUser();
    // log user
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // get user
    const result = service.getUser();
    // assert
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(null);
    expect(JSON.parse(sessionStorage.getItem('user'))).toEqual(mockAuthUser);
    expect(router.navigate).toHaveBeenCalledWith([path]);
    result.subscribe(
      res => {
        expect(res.name).toBe(mockAuthUser.name);
        expect(res.roles).toEqual(mockAuthUser.roles);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#login should set user, localStorage and navigate', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: true
    }
    const path = `/${uiPath.home}`;
    // clear user
    service.resetUser();
    // log user
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // get user
    const result = service.getUser();
    // assert
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockAuthUser);
    expect(JSON.parse(sessionStorage.getItem('user'))).toEqual(null);
    expect(router.navigate).toHaveBeenCalledWith([path]);
    result.subscribe(
      res => {
        expect(res.name).toBe(mockAuthUser.name);
        expect(res.roles).toEqual(mockAuthUser.roles);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#login should fail', () => {
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: true
    }
    // log user first time
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // logout user
    service.resetUser();
    // log user second time (will throw error)
    service.login(mockUser)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch(err => {
        expect(err).toEqual(mockError);
      });
    // get user
    const result = service.getUser();
    // assert
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(null);
    expect(JSON.parse(sessionStorage.getItem('user'))).toEqual(null);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    result.subscribe(
      res => {
        expect(res).toBe(null);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#logout should call #resetUser and return success msg', () => {
    spyOn(service, 'resetUser').and.callThrough();
    const value = logoutStatus.success;
    // get result
    const result = service.logout();
    // assert
    expect(service.resetUser).toHaveBeenCalled();
    result.subscribe(
      res => {
        expect(res).toBe(value);
      },
      () => {
        expect(true).toBe(false);
      }
    )
  });

  it('#logout should call #resetUser and return failure msg', () => {
    spyOn(service, 'resetUser').and.callFake(() => { throw 'error' });
    const value = logoutStatus.failure;
    // get result
    const result = service.logout();
    // assert
    expect(service.resetUser).toHaveBeenCalled();
    result.subscribe(
      res => {
        expect(res).toBe(value);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#resetUser should remove user from storage and set #user to null', () => {
    let name = 'user';
    const mockUser: LoginUser = {
      email: 'test@email.com',
      password: 'fakepassword',
      keepLogged: false
    }
    // log user in
    service.login(mockUser).catch(() => {
      expect(true).toBe(false);
    });
    // set user in storage
    localStorage.setItem(name, JSON.stringify(mockAuthUser));
    // assert for values
    expect(JSON.parse(localStorage.getItem(name))).toEqual(mockAuthUser);
    expect(JSON.parse(sessionStorage.getItem(name))).toEqual(mockAuthUser);
    // arase everything with #resetUser
    service.resetUser();
    // get updated user
    // get user
    let result = service.getUser();
    // assert
    expect(JSON.parse(localStorage.getItem(name))).toEqual(null);
    expect(JSON.parse(sessionStorage.getItem(name))).toEqual(null);
    result.subscribe(
      res => {
        expect(res).toBe(null);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#register should return an observable', () => {
    const mockUser: User = {
      name: 'fake user',
      email: 'fake@mail.com',
      password: 'string',
      confirmPassword: 'string'
    }
    const result = service.register(mockUser);
    // assert
    expect(http.post).toHaveBeenCalledWith(apiPath.register, mockUser);
    expect(result instanceof Observable).toBe(true);
  });

  it('#sendVerification should return an observable', () => {
    const result = service.sendVerification(mockAuthUser.token);
    const path = `${apiPath.verify}/${mockAuthUser.token}`;
    // assert
    expect(http.get).toHaveBeenCalledWith(path);
    expect(result instanceof Observable).toBe(true);
  });

  it('#requestVerificationEmail should return an observable', () => {
    const result = service.requestVerificationEmail(mockAuthUser.id);
    const path = `${apiPath.sendemail}/${mockAuthUser.id}`;
    // assert
    expect(http.get).toHaveBeenCalledWith(path);
    expect(result instanceof Observable).toBe(true);
  });

  it('#requestResetCode should return an observable', () => {
    const mockEmail = 'fake@mail.com';
    const result = service.requestResetCode(mockEmail);
    const path = `${apiPath.sendCode}/${mockEmail}`;
    // assert
    expect(http.get).toHaveBeenCalledWith(path);
    expect(result instanceof Observable).toBe(true);
  });

  it('#sendResetCode should return an observable', () => {
    const mockCode = 'd73j&d@a$d#ad123';
    const result = service.sendResetCode(mockCode);
    const path = `${apiPath.validateCode}/${mockCode}`;
    // assert
    expect(http.get).toHaveBeenCalledWith(path);
    expect(result instanceof Observable).toBe(true);
  });

  it('#resetPassword should return an observable', () => {
    const mockPasswords: ResetPassword = {
      password: 'Ab234/',
      confirmPassword: 'Ab234/',
      token: 'dfj23$dfs@%dfkd2f2'
    }
    const result = service.resetPassword(mockPasswords);
    // assert
    expect(http.post).toHaveBeenCalledWith(apiPath.resetPassword, mockPasswords);
    expect(result instanceof Observable).toBe(true);
  });

});
