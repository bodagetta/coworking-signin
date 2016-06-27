var myApp = angular.module('coworking-signin',['ngCookies']);

myApp.controller('MainCtrl', ['$scope', '$cookies', function($scope, $cookies) {

  $scope.isSubmitted = $cookies.get('isSignedIn');
  console.log($scope.isSubmitted);
  $scope.signedInNames = [];

  var config = {
      apiKey: "AIzaSyAFUVU9zr9b8E1GWDsXyvBptVFLHLNz1ZI",
      authDomain: "coworking-signin.firebaseapp.com",
      databaseURL: "https://coworking-signin.firebaseio.com",
      storageBucket: "coworking-signin.appspot.com",
    };

  firebase.initializeApp(config);

  var database = firebase.database();

  getUsersForToday();

  function getTodayString() {
    var today = new Date();
    var todayString = today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();
    return todayString;
  }

  function getUsersForToday() {
    var todayString = getTodayString();

    firebase.database().ref('/signins/' + todayString).once('value').then(function(snapshot) {
      $scope.signedInNames = [];
      snapshot.forEach(function(child){
        $scope.signedInNames.push(child.val());
      });
      $scope.$apply();
    });
  }

  $scope.signIn = function() {

    var todayString = getTodayString();

    database.ref('signins').child(todayString).push({
      name: $scope.user.name,
      email: $scope.user.email
      }, function(error) {
        if (error) {
          console.log(error);
        }
        else {
          $scope.user.name = "";
          $scope.user.email = "";
          $scope.isSubmitted = true;
          $scope.$apply();
          var expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);
          $cookies.put('isSignedIn', true);
          getUsersForToday();
        }
      }
    );

  }

}]);
