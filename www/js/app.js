(function() {
  var app = angular.module('pictie', ['btford.phonegap.ready']);

  app.controller('AuthenticationController', function(){
    this.user = user;
    this.login = function(){
      this.user.number = this.newNumber;
      this.newNumber = null;
    };
    this.logout = function(){
      this.user.number = null;
    };
  });

  app.controller('MessageController', ['$http', function($http) {
    var messageController = this;

    this.user = user;
    this.newMessage = {};
    this.inbox  = inbox;
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

  var inbox = [
    {recipient: '0606666666', body: 'Ta mere xxxxx des xxxx en enfer !!!'},
    {recipient: '0601111111', body: 'In vino veritas, mes freres !'}
  ];

  var outbox = [];

})();