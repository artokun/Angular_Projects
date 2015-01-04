'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('LandingPageController', [function() {

  }])
  .controller('waitlistController', ['$scope', '$firebase', function($scope, $firebase) {
    var partiesRef = new Firebase('https://waitandeat-art.firebaseio.com/parties');

    $scope.parties = $firebase(partiesRef);

    $scope.newParty = {name:'', phone:'', size:''};

    $scope.saveParty = function() {
      $scope.parties.$add($scope.newParty);
      $scope.newParty = {name:'', phone:'', size:''};
    };

    //function to send a text message to a party
    $scope.sendTextMessage = function(party) {
      var textMessageRef = new Firebase('http://waitandeat-art.firebaseio.com/textMessages');
      var textMessages = $firebase(textMessageRef);
      var newTextMessasge = {
        phone: party.phone,
        size: party.size,
        name: party.name
      };
      textMessages.$add(newTextMessasge);
    };
  }]);
