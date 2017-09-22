
const { sinon, assert } = global;

import apiMiddleware from '../../src/middleware';
import reqMethods from '../../src/reqMethods';
import generateReqTypes from '../../src/generateReqTypes';

describe('Testing Middleware', () => {

  let reqClient, middleware, store, nextStub, action;

  function createMiddleware() {
    middleware = apiMiddleware(reqClient)(store)(nextStub);
  }

  function createAction(type) {
    return { type };
  }

  beforeEach(() => {
    reqClient = {
      get: sinon.stub(),
      post: sinon.stub(),
      put: sinon.stub(),
      patch: sinon.stub(),
      delete: sinon.stub()
    };
    nextStub = sinon.stub();
    action = 'MY_ACTION';
  });

  afterEach(() => {
    reqClient = middleware = store = nextStub = action = null;
  });

  describe('Initialize', () => {

    it('Should call next if not registered request method was passed in action', () => {
      nextStub.returns(1);
      createMiddleware();
      const res = middleware(createAction('myAction'));

      assert.isTrue(nextStub.calledOnce, 'Should call next');
      assert.equal(res, 1, 'Should call next');
    });

    
  });

});