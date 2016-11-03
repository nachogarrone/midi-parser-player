'use strict';

describe('Component: PlayerComponent', function() {
  // load the controller's module
  beforeEach(module('angularNodeApp.player'));

  var PlayerComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PlayerComponent = $componentController('player', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
