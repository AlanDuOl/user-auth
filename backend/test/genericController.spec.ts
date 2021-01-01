import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import genericController from '../src/controllers/genericController';
import { mockRequest, mockResponse } from './mock-data';


describe('genericController', function () {
    let controller = Object.assign({}, genericController);

    beforeEach(function () {
        
    });

    afterEach(function () {
        sinon.restore();
    });

    it('#getPublicAsync should return response object', async function () {
        const code = 200;
        const resObject = { message: 'Public request complete' };
        const response = await controller.getPublicAsync(mockRequest as Request, mockResponse as Response);
        expect(response).to.equals(mockResponse);
        expect((mockResponse.json as sinon.SinonSpy).calledWith(resObject)).to.true;
        expect((mockResponse.status as sinon.SinonSpy).calledWith(code)).to.true;
    });

});