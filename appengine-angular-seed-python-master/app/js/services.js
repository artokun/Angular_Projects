'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://waitandeat-art.firebaseio.com/')
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
      }
    };

    $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
      console.log("User " + user.id + "successfully logged in!");
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