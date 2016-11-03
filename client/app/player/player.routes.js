'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/player', {
      template: '<player></player>'
    });
}
