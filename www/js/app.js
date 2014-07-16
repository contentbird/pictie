(function() {
  var app = angular.module('pictie', ['btford.phonegap.ready']);
  var faye = new Faye.Client('http://localhost:5000/bayeux');

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
      // console.log('inbox list: '+ JSON.stringify(_inbox));
      return _inbox;
    }

    service.add = function(item){
      _inbox.push(item);
      console.log('inbox add:'+ JSON.stringify(_inbox));
      broadcast();
    }

    return service;
  }]);

  app.service('FayeService', ['Inbox', function(Inbox){
    this.subscribe = function(user){
      faye.subscribe('/user/'+user.number, function (data) {
        console.log(data);
        // this.inbox.push(data.message);
        Inbox.add(data.message);
      });
    }
  }]);

  app.controller('AuthenticationController', ['$scope', 'FayeService', function($scope, FayeService){
    this.user = user;
    // this.inbox = inbox;
    // $scope.inbox = Inbox.list();
    // var authController = this;
    this.login = function(){
      this.user.number = this.newNumber;
      this.newNumber = null;
      FayeService.subscribe(this.user);
      // faye.subscribe('/user/'+this.user.number, function (data) {
      //   console.log(data);
      //   // this.inbox.push(data.message);
      //   Inbox.add(data.message);
      // });
    };
    this.logout = function(){
      this.user.number = null;
    };
  }]);

  app.controller('MessageController', ['$http', '$scope', 'Inbox', function($http, $scope, Inbox) {
    var messageController = this;

    this.user = user;
    this.newMessage = {};
    // this.inbox  = inbox;

    $scope.inbox = Inbox.list();

    Inbox.onUpdate($scope, function() {
      $scope.inbox = Inbox.list();
      $scope.$apply();
    });

    // $scope.$watch('inbox', function (newVal, oldVal) {
    //   console.log('WATCH: inbox changed' + JSON.stringify(newVal) + ' to ' + JSON.stringify(oldVal));
    // });

    this.outbox = outbox;

    this.canPost = function(){
      return this.user.number && this.user.number.length
    };

    this.messageSent = function(data){
      messageController.outbox.push(data.message);
      messageController.newMessage = {};
    };

    this.sendMessage = function(){
      $http.post('http://localhost:5000/messages', { sender: this.user.number,
                                                     recipient: this.newMessage.recipient,
                                                     body: this.newMessage.body}).
            success(this.messageSent).
            error(function(data){
              alert('Error : your message was not sent');
            });
    };


  }]);

  var user = {};

  // var inbox = [{sender: 'temp', recipient: 'temp', body: 'temp'}];

  var outbox = [];

})();