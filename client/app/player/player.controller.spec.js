'use strict';

describe('Controller: PlayerCtrl', function() {
  // load the controller's module
  beforeEach(module('angularNodeApp.player'));

  var PlayerCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    PlayerCtrl = $controller('PlayerCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
