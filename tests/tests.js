    /* Test Code */
   
    describe('trialMaMaApp', function () {
      var $controller;
      beforeEach(function(){
          angular.mock.module('trialMaMaApp');
          angular.mock.inject(function(_$controller_){
            $controller = _$controller_;
          });
      });

      describe('loginController', function () {
        it('errorMesage should not be displayed', function () {
          var $scope = {};
          var controller = $controller('loginController', { $scope: $scope });
          expect($scope.showErrorMessage).toBeFalsy();
          expect($scope.errorMessage).toBe('');
        });
      });
      describe('registerController', function(){
          it('errorMesage should not be displayed', function(){
             var $scope = {};
             var controller = $controller('registerController', { $scope: $scope });
             expect($scope.showErrorMessage).toBeFalsy();
             expect($scope.errorMessage).toBe('');
          })
      })
      describe('profileController', function(){
          it('user on the scope should be non-null', function(){
             var user = {
                 firstName: 'Test',
                 lastName: 'Test'
             }
             var $scope = {};
             var controller = $controller('registerController', { $scope: $scope, user: user });
             expect($scope.user).not.toBeNull();
          })
      })
      describe('editController', function(){
          it('edited user on the scope should be non-null', function(){
             var editedUser = {
                 firstName: 'Test',
                 lastName: 'Test'
             }
             var $scope = {};
             var controller = $controller('registerController', { $scope: $scope, editedUser: editedUser });
             expect($scope.user).not.toBeNull();
          })
      })

   });
