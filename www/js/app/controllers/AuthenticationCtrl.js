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