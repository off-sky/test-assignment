angular.module('trialMaMaApp')
.constant('configs', {
    firebase_url: 'https://trial-mama.firebaseio.com'
})
.controller('loginController', ['$scope', '$firebaseAuth', '$state', function($scope, $firebaseAuth, $state){
    $scope.candidate = {
        email: '',
        password: ''
    }
    $scope.showErrorMessage = false;
    $scope.errorMessage = '';
    var MISSINGPASSWORDMESSAGE = 'You should enter your password.';
    var MISSINGEMAILMESSAGE = 'You should enter your valid email.';
    var MISSINGEMAILANDPASSWORDMESSAGE = 'You should enter your valid email and password.';
    var WRONGEMAILMESSAGE = 'No such user.'
    var WRONGPASSWORDMESSAGE = 'Wrong password.'
    var CANNOTLOGINMESSAGE = "Login failure."
    
        
    $scope.doLogIn = function(){
        //form validation
        if (!$scope.candidate.email && !$scope.candidate.password) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = MISSINGEMAILANDPASSWORDMESSAGE;
            return;
        }
        if (!$scope.candidate.email) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = MISSINGEMAILMESSAGE;
            return;
        }
        if (!$scope.candidate.password) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = MISSINGPASSWORDMESSAGE;
            return;
        }
        
        //sign in to firebase
        firebase.auth().signInWithEmailAndPassword($scope.candidate.email, $scope.candidate.password).then(function(){
            var uid = firebase.auth().currentUser.uid;
            console.log(firebase.auth().currentUser);
            $state.go('app.profile', {userId: firebase.auth().currentUser.uid});
        }, function(error) {                     //something went wrong with the server
            $scope.showErrorMessage  = true;
            console.log(error);
            if (error.code == "auth/user-not-found") 
             $scope.errorMessage = WRONGEMAILMESSAGE;
            else if (error.code == "auth/wrong-password")
              $scope.errorMessage = WRONGPASSWORDMESSAGE
            else
             $scope.errorMessage = CANNOTLOGINMESSAGE;
            $scope.$apply();
        })
    }
}])

.controller('registerController', ['$scope', '$state', function($scope, $state){
    //empty object for data binding
    $scope.newUser = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confPassword: '',
        age: 10,
        country: '',  
    }
    
    $scope.showErrorMessage = false;
    $scope.errorMessage = '';
    var MISSINGPASSWORDMESSAGE = 'You should enter your password.';
    var MISSINGEMAILMESSAGE = 'You should enter your valid email.';
    var MISSINGEMAILANDPASSWORDMESSAGE = 'You should enter your valid email and password.';
    var PASSWORDDONTMATCHMESSAGE = 'Your password and confirm password don\'t match.';
    var PASSWORDTOOSHORTMESSAGE = 'Your password should be at least 6 characters long.';
    var GENERALERRORMESSAGE = 'Registration failed due to server error.'
    
    $scope.doRegister = function(){
        
        //form validation
        if (!$scope.newUser.email && !$scope.newUser.password) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = MISSINGEMAILANDPASSWORDMESSAGE;
            return;
        }
        if (!$scope.newUser.email) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = MISSINGEMAILMESSAGE;
            return;
        }
        if (!$scope.newUser.password) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = MISSINGPASSWORDMESSAGE;
            return;
        }
        if ($scope.newUser.password.length < 6) {
            $scope.showErrorMessage  = true;
            $scope.errorMessage = PASSWORDTOOSHORTMESSAGE;
            return;
        }
        if ($scope.newUser.password !== $scope.newUser.confPassword){
            $scope.showErrorMessage  = true;
            $scope.errorMessage = PASSWORDDONTMATCHMESSAGE;
            return;
        }
        
        //create user with firebase
        firebase.auth().createUserWithEmailAndPassword($scope.newUser.email, $scope.newUser.password).then(function(user){
            
            //delete unnecessary details
            delete $scope.newUser.password;
            delete $scope.newUser.confPassword;
            delete $scope.newUser.email;
            //create user document in the users collection to store additional details
            firebase.database().ref("users").child(user.uid).set($scope.newUser);
            console.log('Success!');
            console.log(user);
            $state.go('app.profile', {userId:user.uid});
            //Something went wrong with the server
        }, function(error){
            $scope.showErrorMessage = true;
            $scope.errorMessage = GENERALERRORMESSAGE;
            $scope.$apply();
        })
        
    }
}])

.controller('profileController', ['$scope', 'user', '$state', function($scope, user, $state){
    //we need it to proceed to edit state. See template
    $scope.uid = firebase.auth().currentUser.uid;
    
    $scope.user = user;
    console.log(user);
    $scope.doLogOut = function(){
        firebase.auth().signOut().then(function(){
            console.log('Sign out successful!');
            $state.go('app');
        }, function(){
            console.log('Sign out error');
        })
        console.log(firebase.auth().currentUser);
    }
}])

.controller('editController', ['$scope', 'editedUser', '$state', function($scope, editedUser, $state){
    //we need it to proceed to profile state.
    $scope.uid = firebase.auth().currentUser.uid;
    
    $scope.editedUser = editedUser;
    $scope.saveChanges = function(){
        firebase.database().ref('users/'+$scope.uid).set($scope.editedUser);
        $state.go('app.profile', {userId: $scope.uid})
    }
}])