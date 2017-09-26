'use strict';

// Declare app level module which depends on views, and components
angular.module('agentsApp', [
  'ngRoute',
  'agentsApp.agents'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/agents'});
}]);
