'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('LandingPageController', [function() {

  }])
  .controller('waitlistController', ['$scope', '$firebase', function($scope, $firebase) {
    var partiesRef = new Firebase('https://waitandeat-art.firebaseio.com/parties');

    $scope.parties = $firebase(partiesRef);

    $scope.newParty = {name:'', phone:'', size:'', done: false, notified:'No'};

    $scope.saveParty = function() {
      $scope.parties.$add($scope.newParty);
      $scope.newParty = {name:'', phone:'', size:'', done: false, notified:'No'};
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
      party.notified = 'Yes'; // Code here for notified
      $scope.parties.$save(party.$id);
    };
  }])
  .controller('AuthController', ['$scope', '$firebaseSimpleLogin', function($scope, $firebaseSimpleLogin) {
    var authRef = new Firebase('http://waitandeat-art.firebaseio.com/');

    var auth = $firebaseSimpleLogin(authRef);

    $scope.user = {email:'', password:''};

    $scope.register = function() {
      auth.$createUser($scope.user.email, $scope.user.password).then(function(data) {
        console.log(data);
        $scope.login();
        //TODO: show error when registration fails
        //TODO: make password criteria with jQuery
      });//.then(functionSuccess(data), functionFailure(data))
    };

    $scope.login = function() {
      auth.$login('password', $scope.user).then(function(data) {
        console.log(data);
        //Redirect users to the waitlist page /waitlist
        $location.path('/waitlist');
      });
    };

    $scope.logout = function() {
      auth.$logout();
      //Redirect users to the landing page /
      $location.path('/');
    };
  }]);
