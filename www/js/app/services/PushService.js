app.service('PushService', ['$cordovaPush' , '$http', function($cordovaPush, $http) {

  this.pushConfiguration = {};
  this.user = null;
  this.eventReceived = {};

  this.init = function (user) {
    this.user = user;
    if (window.runningOnDevice() == true) {
      this.setPushConfiguration();
      this.registerDevice();
    }
    // TODO: Optimization: registering device should only be done on first install, not every time app is launched
    // The token should be stored on local device and reused if it exist
  };

  this.setPushConfiguration = function() {
    if ( device.platform == 'android' || device.platform == 'Android') {
      this.pushConfiguration = {"provider": "GCM", "params": { "senderID":"632726955930", "ecb":"CGMCallbackHandler" }};
    }
    else {
      this.pushConfiguration = {"provider": "APNS", "params": { "badge":"true", "sound":"true", "alert":"true", "ecb":"APNCallbackHandler" }};
    }
  };

  this.registerDevice = function(){
    var that = this;
    try {
      $cordovaPush.register(this.pushConfiguration['params']).then(function(registration_response) {
        if (that.pushConfiguration['provider'] == "APNS") {
          that.storeTokenOnServer(registration_response);
        }
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

  // handle GCM notifications for Android
  this.onNotification = function (e) {
    this.eventReceived = e;
    // alert("event received" + JSON.stringify(e))
    switch( e.event ) {
      case 'registered':
        if ( e.regid.length > 0 ) {
          this.storeTokenOnServer(e.regid);
          // Your GCM push server needs to know the regID before it can push to this device
          // here is where you might want to send it the regID for later use.
        }
        break;

      case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if (e.foreground) {
          // alert('INLINE NOTIFICATION');
          // if the notification contains a soundname, play it. playing a sound also requires the org.apache.cordova.media plugin
          var my_media = new Media("/android_asset/www/"+ e.soundname);
          my_media.play();
        }
        else { // otherwise we were launched because the user touched a notification in the notification tray.
          // if (e.coldstart)
          //   alert('COLDSTART NOTIFICATION');
          // else
          //   alert('BACKGROUND NOTIFICATION');
        }
        // alert('MSG: '+e.payload.collapseKey);
        break;

      case 'error':
        alert('ERROR MSG: '+ e.msg + 'MSGCNT ' + e.payload.msgcnt);
        break;

      default:
        alert('EVENT Unknown, an event was received and we do not know what it is');
        break;
    }
  }

}]);