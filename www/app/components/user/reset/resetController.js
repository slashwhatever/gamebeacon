angular.module('destinybuddy.user.reset.controllers', ['destinybuddy.services'])


.controller('ResetController', ['$rootScope', '$scope', '$state', 'AuthService', 'UIService', 'UtilsService', function($rootScope, $scope, $state, AuthService, UIService, UtilsService) {

    $scope.user = {email: ''};
    $scope.requestPasswordReset = function(form) {
        if(form.$valid) {
        AuthService.requestPasswordReset($scope.user.email)
            .then(function(response) {
                UIService.showAlert({
                    title: 'Done!',
                    template: 'If your email addres is registered with gamebeacon, you will shortly receive instructions to reset your password.'
                })
            })
        }
    };
}])