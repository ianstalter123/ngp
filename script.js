var module = angular.module('presenceChannels', ['720kb.tooltips']);

module.directive("item", ['presence', function(presence) {
  return {

    restrict: 'E',
    scope: {},
    link: function(scope, element, attrs) {

      console.log(attrs)
      console.log(presence)
      if(scope.content){
        scope.channel = presence.subscribe(scope.content);
      }
      scope.chan = attrs.ngPresence;

      scope.$on('$destroy', function() {
        presence.unsubscribe(scope.content)
      });
    },
    templateUrl: './templates/presence.html',
    scope: {
      content: '=ngPresence',
      start: '=startAt',
      limit: '=limit'
    }
  }
}])
module.filter('startFrom', function() {
  return function(input, start) {
    if(input) {
            start = +start; //parse to int
            return input.slice(start);
          }
          return [];
        }
      });
module.controller('PresenceCtrl', [
  '$scope',
  'presence',
  function($scope, presence){
     $scope.channels = ["channel1","channel2","channel3","channel4","channel5"]

    $scope.randomize = function(){
      presence.update();  
      console.log(presence)
    }
  }
  ]);

// Auth mock.
module.factory('auth', [
  function(){
    return {
      currentUser: {
        name: 'Kelly User',
        username: 'kelly',
        imageUrl: "http://api.randomuser.me/portraits/med/women/39.jpg"
      }
    };
  }
  ]);

// Presence mock.
module.factory('presence', [
  '$filter',
  '$http',
  'auth',
  function($filter, $http, auth){
    var capitalize = $filter('uppercase');
    var channels = {};
    return {
      // Subscribe to the channel.
      subscribe: function(channelName){
        var channel = channels[channelName];
        if(!channel){
          channel = channels[channelName] = [];
        }
        channel.push(auth.currentUser);
        return channel;
      },
      
      // Unsubscribe from the channel.
      unsubscribe: function(channelName){
        delete channels[channelName];
      },
      
      // Adds or removes a random user to all current channels, for testing.
      update: function(){
       // console.log(channels)

       $http({
        method: 'GET',
        url: 'https://randomuser.me/api'
      }).then(function(response){
        var randomUser = response.data.results[0].user;
        //  console.log(randomUser);
        var user = {
          name: capitalize(randomUser.name.first) + ' ' + capitalize(randomUser.name.last),
          username: randomUser.username,
          imageUrl: randomUser.picture.medium
        };

        _.forEach(channels, function(channel, channelName){
          if(Math.random() < 0.75){
            channel.push(user);
              //console.log(channel.length)


            }
            else if(channel.length > 1){
              channel.pop();
            }
          });
      });
    }
  };
}
]);
