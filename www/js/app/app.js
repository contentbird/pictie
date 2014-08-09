// var SERVER_URL = 'http://pictie-dev.herokuapp.com';
// var SERVER_URL = 'http://localhost:5000';
var SERVER_URL = 'http://192.168.1.14:5000';

var app = angular.module('pictie', ['btford.phonegap.ready', 'ngCordova']);
var user = {};
var outbox = [];

app.run(['$rootScope', 'CordovaService', function($rootScope, CordovaService) {
  CordovaService.registerEvents();
}]);