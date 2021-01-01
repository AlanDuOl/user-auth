import { Request, Response } from 'express';
import { spy, stub } from 'sinon';

export const mockRequest: Partial<Request> = {
    body: {},
    cookies: {},
    query: {},
    params: {}
}
export const mockResponse: Partial<Response> = {
    clearCookie: spy(),
    cookie: spy(),
    download: spy(),
    end: spy(),
    status: stub().returnsThis(),
    format: spy(),
    json: stub().returnsThis(),
    jsonp: spy(),
    redirect: spy(),
    render: spy(),
    send: spy(),
    sendFile: spy(),
    sendStatus: spy(),
    set: spy(),
    type: spy()
}