'use strict';
const angular = require('angular');

/*@ngInject*/
export function playerController() {
  this.message = 'Hello';
}

export default angular.module('angularNodeApp.player', [])
  .controller('PlayerController', playerController)
  .name;
