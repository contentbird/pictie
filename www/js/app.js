(function() {
  var SERVER_URL = 'http://pictie.herokuapp.com';
  var app = angular.module('pictie', ['btford.phonegap.ready']);
  var faye = new Faye.Client(SERVER_URL+'/bayeux');

  app.factory('Inbox', ['$rootScope', function($rootScope){
    var _inbox = [{sender: 'temp', recipient: 'temp', body: 'temp'}];
    var service = {};

    var broadcast = function () {
      $rootScope.$broadcast('inbox.update');
    };

    service.onUpdate = function ($scope, callback) {
      $scope.$on('inbox.update', function () {
        callback();
      });
    };

    service.list = function(){
      return _inbox;
    }

    service.add = function(item){
      _inbox.push(item);
      broadcast();
    }

    return service;
  }]);

  app.service('FayeService', ['Inbox', function(Inbox){
    this.subscribe = function(user){
      faye.subscribe('/user/'+user.number, function (data) {
        Inbox.add(data.message);
      });
    }
  }]);

  app.controller('AuthenticationController', ['$scope', 'FayeService', function($scope, FayeService){
    this.user = user;
    this.login = function(){
      this.user.number = this.newNumber;
      this.newNumber = null;
      FayeService.subscribe(this.user);
    };
    this.logout = function(){
      this.user.number = null;
    };
  }]);

  app.controller('MessageController', ['$http', '$scope', 'Inbox', function($http, $scope, Inbox) {
    var messageController = this;

    this.user = user;
    this.newMessage = {};

    $scope.inbox = Inbox.list();

    Inbox.onUpdate($scope, function() {
      $scope.inbox = Inbox.list();
      $scope.$apply();
    });

    this.outbox = outbox;

    this.canPost = function(){
      return this.user.number && this.user.number.length
    };

    this.messageSent = function(data){
      messageController.outbox.push(data.message);
      messageController.newMessage = {};
    };

    this.sendMessage = function(){
      $http.post(SERVER_URL+'/messages', { sender: this.user.number,
                                           recipient: this.newMessage.recipient,
                                           body: this.newMessage.body}).
            success(this.messageSent).
            error(function(data){
              alert('Error : your message was not sent');
            });
    };


  }]);

  var user = {};

  var outbox = [];

})();