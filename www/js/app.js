(function() {
  var SERVER_URL = 'http://pictie-dev.herokuapp.com';
  var app = angular.module('pictie', ['btford.phonegap.ready']);
  var faye = new Faye.Client(SERVER_URL+'/bayeux');
  var user = {};
  var outbox = [];

  app.factory('Inbox', ['$rootScope', function($rootScope){
    var _inbox = [{sender: 'default', recipient: 'inbox', body: 'message'}];
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

  app.service('FayeService', ['Inbox', function (Inbox){
    this.subscribe = function(user){
      faye.subscribe('/user/'+user.number, function (data) {
        Inbox.add(data.message);
        // window.plugin.notification.local.add({
        //     id:         Date.now().toString(),  // A unique id of the notifiction
        //     message:    "There is a Pictie for you",  // The message that is displayed
        //     title:      "New pictie",  // The title of the message
        //     json:       {},  // Data to be passed through the notification
        //     autoCancel: true, // Setting this flag and the notification is automatically canceled when the user clicks it
        //     ongoing:    false, // Prevent clearing of notification (Android only)
        // });
      });
    }
  }]);

  app.service('EventService', ['phonegapReady', function(phonegapReady){
    this.registerEvents = function(){
      // phonegapReady(function () {
        // alert('DEVICE is ready maaan');
        document.addEventListener("resume", onResume, false);
        document.addEventListener("pause", onPause, false);

        function onResume() {
          console.log('On Resume');
          alert('ON RESUME')
        }

        function onPause() {
          console.log('On Pause');
          alert('ON PAUSE')
        }
      // });
    };
  }]);

  app.controller('AuthenticationController', ['$scope', 'FayeService', function ($scope, FayeService){
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

  app.run(['$rootScope', 'EventService', function($rootScope, EventService) {
    EventService.registerEvents();
  }]);

})();