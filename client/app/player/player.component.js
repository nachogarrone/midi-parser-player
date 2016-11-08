'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './player.routes';

export class PlayerController {
  $http;
  $scope;
  parseResult = '';

  /*@ngInject*/
  constructor($http, $scope) {
    this.$http = $http;
    this.$scope = $scope;
    this.parseResult = '';
  }

  parse() {
    console.log(this.$scope.text);
    var myObj = {};
    myObj["input"] = this.$scope.text;
    this.$http.post('/api/parsers', myObj)
      .then(response => {
        this.parseResult = response.statusText;
      })
      .catch(this.parseResult = "Error parsing text.");
  }
}

export default angular.module('angularNodeApp.player', [ngRoute])
  .config(routes)
  .component('player', {
    template: require('./player.html'),
    controller: PlayerController
  })
  .name;
