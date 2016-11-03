'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var parserCtrlStub = {
  index: 'parserCtrl.index',
  show: 'parserCtrl.show',
  create: 'parserCtrl.create',
  upsert: 'parserCtrl.upsert',
  patch: 'parserCtrl.patch',
  destroy: 'parserCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var parserIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './parser.controller': parserCtrlStub
});

describe('Parser API Router:', function() {
  it('should return an express router instance', function() {
    expect(parserIndex).to.equal(routerStub);
  });

  describe('GET /api/parsers', function() {
    it('should route to parser.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'parserCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/parsers/:id', function() {
    it('should route to parser.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'parserCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/parsers', function() {
    it('should route to parser.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'parserCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/parsers/:id', function() {
    it('should route to parser.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'parserCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/parsers/:id', function() {
    it('should route to parser.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'parserCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/parsers/:id', function() {
    it('should route to parser.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'parserCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
