(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.controller('ResetPassword', ResetPassword);

	ResetPassword.$inject = ['$rootScope', '$scope', '$state', 'AuthService', 'UIService', 'UtilsService'];

	function ResetPassword($rootScope, $scope, $state, AuthService, UIService, UtilsService) {
    $scope.user = {email: ''};
    $scope.requestPasswordReset = function(form) {
        if(form.$valid) {
        AuthService.requestPasswordReset($scope.user.email)
            .then(function(response) {
                UIService.showAlert({
                    title: 'Done!',
                    template: 'If your email address is registered with gamebeacon, you will shortly receive instructions to reset your password.'
                })
            })
        }
    };
  }
})();