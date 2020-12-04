import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, convertToParamMap, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { AuthUser, IUser } from './models';

@Component({
    selector: 'mock-component'
})
export class MockComponent { }

export const mockUser: IUser = {
    name: 'test user',
    roles: ['User', 'Admin']
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
