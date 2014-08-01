(function() {
  var SERVER_URL = 'http://pictie-dev.herokuapp.com';
  // var SERVER_URL = 'http://localhost:5000';
  // var SERVER_URL = 'http://192.168.1.14:5000';
  var app = angular.module('pictie', ['btford.phonegap.ready', 'ngCordova']);
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

    this.init = function(user) {
      this.authenticate(user);
      this.subscribe(user);
    }

    this.authenticate = function(user){
      faye.addExtension({
        outgoing: function(message, callback) {
          // Again, leave non-subscribe messages alone
          if (message.channel !== '/meta/subscribe') {
            return callback(message);
          }

          // Add ext field if it's not present
          if (!message.ext) message.ext = {};
          message.ext.authToken = 'secret';

          message.ext.userId       = user.number;
          message.ext.pushPlatform = 'CGM';
          message.ext.pushToken    = 'dkfilsf';

          // Carry on and send the message to the server
          callback(message);
        }
      });
    }

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

  app.service('CordovaService', ['phonegapReady', function(phonegapReady){
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

  app.controller('AuthenticationController', ['$scope', 'FayeService', 'PushService', function ($scope, FayeService, PushService){
    this.user = user;
    this.login = function(){
      this.user.number = this.newNumber;
      this.newNumber = null;
      FayeService.init(this.user);
      PushService.init(this.user);
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

  app.service('PushService', ['$cordovaPush' , '$http', function($cordovaPush, $http) {

    this.pushConfiguration = {};
    this.user = null;

    this.init = function (user) {
      this.user = user;
      this.setPushConfiguration();
      this.registerDevice();
      // TODO: Optimization: registering device should only be done on first install, not every time app is launched
      // The token should be stored on local device and reused if it exist

    };

    this.setPushConfiguration = function() {
      if ( device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos') {
        this.pushConfiguration = {"provider": "CGM", "params": { "senderID":"632726955930", "ecb":"this.onNotification"}};
      }
      else {
        this.pushConfiguration = {"provider": "APNS", "params": { "badge":"true", "sound":"true", "alert":"true", "ecb":"APNCallbackHandler" }};
      }
    };

    this.registerDevice = function(){
      var that = this;
      try {
        $cordovaPush.register(this.pushConfiguration['params']).then(function(token) {
          that.storeTokenOnServer(token);
        }, function(err) {
          alert('error ' + err);
        });
      }
      catch(err) {
        txt="There was an error on device registration.\n\n";
        txt+="Error description: " + err.message + "\n\n";
        alert(txt);
      }
    }

    this.storeTokenOnServer = function(token) {
      $http.post(SERVER_URL+'/push_registration', { userId: this.user.number,
                                                    pushProvider: this.pushConfiguration['provider'],
                                                    pushToken: token }).
      success(this.tokenStored).
      error(function(data){
        alert('Error : could not store token on pictie server');
      });
    };

    this.tokenStored = function(data) {
      // alert('in tokenStored' + JSON.stringify(data));
    };

    this.onNotificationAPN = function (e) {
      if (e.alert) {
        // showing an alert also requires the org.apache.cordova.dialogs plugin
        navigator.notification.alert(e.alert);
      }

      if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
      }

      if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
      }
    };

  }]);

  app.run(['$rootScope', 'CordovaService', function($rootScope, CordovaService) {
    CordovaService.registerEvents();
  }]);

})();