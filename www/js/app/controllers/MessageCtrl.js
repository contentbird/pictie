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