import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, convertToParamMap, UrlSegment } from '@angular/router';
import { AuthUser, IUser } from './models';

@Component({
    selector: 'app-auth-menu'
})
export class MockAuthMenuComponent { }

@Component({
    selector: 'mock-component'
})
export class MockComponent { }

export const mockUser: IUser = {
    name: 'test user',
    roles: ['User', 'Admin']
}

export const mockError = {
    error: { message: 'error message'}
}

export const mockAuthUser: AuthUser = {
    id: 1,
    name: 'mockuser',
    token: 'dkfjskldfjklejf',
    exp: 210,
    roles: ['User']
}

export const mockRouteSnapshot: ActivatedRouteSnapshot = {
    url: [
        new UrlSegment('logout', { name: 'logout' }),
        new UrlSegment('logout', { name: 'logout' })
    ],
    paramMap: convertToParamMap({ id: 1 }),
    queryParamMap: convertToParamMap({ token: 'abd23f/sdf12d' }),
    queryParams: {},
    routeConfig: {},
    params: {},
    data: {},
    component: '',
    fragment: '',
    outlet: '',
    parent: null,
    root: null,
    firstChild: null,
    children: null,
    pathFromRoot: null
}

export const mockRouteSnapshotFail: ActivatedRouteSnapshot = {
    url: [
        new UrlSegment('logout', { name: 'logout' }),
        new UrlSegment('logout', { name: 'logout' })
    ],
    paramMap: convertToParamMap({}),
    queryParamMap: convertToParamMap({}),
    queryParams: {},
    routeConfig: {},
    params: {},
    data: {},
    component: '',
    fragment: '',
    outlet: '',
    parent: null,
    root: null,
    firstChild: null,
    children: null,
    pathFromRoot: null
}

export const MockConfirm = {
    
    message: undefined,
    returnValue: null,
    originalConfirm: null,

    install: function() {
      MockConfirm.message = undefined;
      MockConfirm.returnValue = true;
      MockConfirm.originalConfirm = window.confirm;
  
      window.confirm = function(message) {
        MockConfirm.message = message;
        return MockConfirm.returnValue;
      };
    },
  
    uninstall: function() {
      window.confirm = MockConfirm.originalConfirm;
    },
  
    willReturn: function(returnValue) {
      MockConfirm.returnValue = returnValue;
    }

};
