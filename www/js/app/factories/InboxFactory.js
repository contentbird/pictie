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