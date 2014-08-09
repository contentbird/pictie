app.service('FayeService', ['Inbox', function (Inbox){
  var fayeClient   = null;
  var userId       = null;
  var subscription = null;
  var status       = null;

  this.init = function(user) {
    userId     = user.number;
    this.connect();
  }

  this.connect = function(){
    fayeClient = new Faye.Client(SERVER_URL+'/bayeux');
    this.authenticate();
    this.subscribe();
  }

  this.disconnect = function(){
    fayeClient.disconnect();
  }

  this.authenticate = function(){
    fayeClient.addExtension({
      outgoing: function(message, callback) {
        // Again, leave non-subscribe messages alone
        if (message.channel !== '/meta/subscribe') {
          return callback(message);
        }

        // Add ext field if it's not present
        if (!message.ext) message.ext = {};
        message.ext.authToken = 'secret';
        message.ext.userId    = userId;

        // Carry on and send the message to the server
        callback(message);
      }
    });
  }

  this.subscribe = function(){
    subscription = fayeClient.subscribe('/user/'+userId, function (data) {
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