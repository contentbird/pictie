(function() {
  var app = angular.module('pictie', ['btford.phonegap.ready']);

  app.controller('AuthenticationController', function(){
    this.user = user;
    this.login = function(){
      this.user.number = this.newNumber;
      this.newNumber = null;
    };
    this.logout = function(){
      this.user = {};
    };
  });

  var user = {};

})();