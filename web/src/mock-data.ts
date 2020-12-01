import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, convertToParamMap, UrlSegment } from '@angular/router';
import { of } from 'rxjs';

@Component({
    selector: 'mock-component'
})
export class MockComponent { }

export const mockRouteSnapshot: ActivatedRouteSnapshot = {
    url: [
        new UrlSegment('logout', { name: 'logout' }),
        new UrlSegment('logout', { name: 'logout' })
    ],
    paramMap: convertToParamMap(of({ id: 1 })),
    queryParamMap: convertToParamMap(of({})),
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