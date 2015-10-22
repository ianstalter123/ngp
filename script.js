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
      //console.log(attrs.ngPresence)
      //console.log(scope)
      scope.chan = attrs.ngPresence;
    },
    templateUrl: './templates/presence.html',
    controller: 'PresenceCtrl',

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

    //so basically if the directive is hidden , it will be 
    //unsubcribed
    //maybe need to create a custom controller that also
    //allows for hiding based on unsubscribing
    //subscribe to the data channel in the directive placed
    //basically should do a test in terms of making a controller
    // that is isolated to this one item so I can access content
    //$scope.extras = "123123"

    $scope.randomize = function(){
      presence.update();
      $scope.extras = ""

      //console.log($scope.$$nextSibling.channel)
      for(var i = $scope.limit; i < $scope.$$nextSibling.channel.length; i++ ){
        console.log(i)
       // console.log($scope.$$nextSibling.channel[i])
       $scope.extras += "99"
        console.log($scope.extras);   
      }
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
