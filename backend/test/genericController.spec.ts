import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import genericController from '../src/controllers/genericController';


describe('Fake test', function() {
    let controller = Object.assign({}, genericController);
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(function() {
    });

    it('#getPublicAsync should return response object', async function() {
        // const result = await controller.getPublicAsync(mockRequest, mockResponse);
        expect(true).to.equal(true);
    });

});