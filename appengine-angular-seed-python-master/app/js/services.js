'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://waitandeat-art.firebaseio.com/')
  .factory('dataService', function($firebase, FIREBASE_URL) {
    var dataRef = new Firebase(FIREBASE_URL);
    var fireData = $firebase(dataRef);

    return fireData;
  })
  .factory('partyService', function(dataService) {
      //Connect $scope.parties to live Firebase data
    var users = dataService.$child('users');
    
    var partyServiceObject = {
      saveParty: function(party, userId) {
        users.$child(userId).$child('parties').$add(party);
      },
      getPartiesByUserId: function(userId) {
        return users.$child(userId).$child('parties');
      }
    };

      return partyServiceObject;
  })
  .factory('textMessageService', function(dataService, partyService) {
    var textMessages = dataService.$child('textMessages');

    var textMessageServiceObject = {
      sendTextMessage: function(party){
        var newTextMessage = {
          phone: party.phone,
          size: party.size,
          name: party.name
        };
        textMessages.$add(newTextMessage)
        party.notified = 'Yes';
        partyService.parties.$save(party.$id);
      }
    };

    return textMessageServiceObject;


    textMessages.$add(newTextMessasge);
    party.notified = 'Yes'; // Code here for notified
    $scope.parties.$save(party.$id);
  })
  .factory('authService', function($firebaseSimpleLogin, $location, FIREBASE_URL, $rootScope) {
    var authRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseSimpleLogin(authRef);

    var authServiceObject = {
      register: function(user) {
        auth.$createUser(user.email, user.password).then(function(data) {
          console.log(data);
          authServiceObject.login(user);
        });
      },
      login: function(user) {
        auth.$login('password', user).then(function(data) {
          console.log(data);
          $location.path('/waitlist');
        });
      },
      logout: function(){
        auth.$logout();
        $location.path('/');
      },
      getCurrentUser: function() {
        return auth.$getCurrentUser();
      }
    };

    $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
      console.log("User " + user.id + " successfully logged in!");
      //Save currentUser on our rootScope.
      $rootScope.currentUser = user;
    });
    $rootScope.$on("$firebaseSimpleLogin:logout", function() {
      console.log("User has successfully logged out!");
      //Save currentUser on our rootScope.
      $rootScope.currentUser = null;
    });

    return authServiceObject;
});