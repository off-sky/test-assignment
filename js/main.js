angular.module('trialMaMaApp', [
    'firebase', 'ui.router'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    //configure firebase
    var config = {
        apiKey: "AIzaSyAGamrxyJqEM1M1cP_uOILhtzmg3Tff-5g",
        authDomain: "trial-mama.firebaseapp.com",
        databaseURL: "https://trial-mama.firebaseio.com",
        storageBucket: "trial-mama.appspot.com",
        messagingSenderId: "499086250483"
    };
//    Check if there is already an initialized firebase app instance. This is done to
//    avoid "Firebase already exists error" in unit testing.
   if (firebase.apps.length == 0) firebase.initializeApp(config);
  
  //configure routing
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('app', {
        url: '/',
        views: {
            mainContent: {
                templateUrl: 'views/login.html',
                controller: 'loginController'
            }
        }
    })
    .state('app.register', {
        url: 'register',
        views: {
            'mainContent@': {
                templateUrl: 'views/register.html',
                controller: 'registerController'
            }
        }
    })
    .state('app.profile', {
        url: 'profile/:userId',
        views: {
            'mainContent@': {
                templateUrl: 'views/profile.html',
                controller: 'profileController',
                resolve: {
                    user: ['$stateParams', function($stateParams){
                        return firebase.database().ref("users/"+$stateParams.userId).once("value").then(function(snapshot){
                            return snapshot.val();
                        })
                    }]
                }
            }
        }
    })
    .state('app.edit', {
        url: 'edit/:userId',
        views: {
            'mainContent@': {
                templateUrl: 'views/edit.html',
                controller: 'editController',
                resolve: {
                    editedUser: ['$stateParams', function($stateParams){
                        return firebase.database().ref("users/"+$stateParams.userId).once("value").then(function(snapshot){
                            return snapshot.val();
                        })
                    }]
                }
            }
        }
    })
    
}])