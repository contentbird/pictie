app.service('CordovaService', ['phonegapReady', 'FayeService', function(phonegapReady, FayeService){
  this.registerEvents = function(){
    // phonegapReady(function () {
      // alert('DEVICE is ready maaan');
      document.addEventListener("resume", onResume, false);
      document.addEventListener("pause", onPause, false);

      function onResume() {
        FayeService.connect();
      }

      function onPause() {
        FayeService.disconnect() //Although not using Cordova API nor any plugin, this code is only excuted when apps is back on foreground
      }
    // });
  };
}]);