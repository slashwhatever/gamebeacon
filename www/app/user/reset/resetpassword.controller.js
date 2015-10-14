(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.controller('ResetPasswordController', ResetPasswordController);

	ResetPasswordController.$inject = ['$rootScope', '$scope', '$state', 'Auth', 'UI', 'Utils'];

	function ResetPasswordController($rootScope, $scope, $state, Auth, UI, Utils) {
    $scope.user = {email: ''};
    $scope.requestPasswordReset = function(form) {
        if(form.$valid) {
        Auth.requestPasswordReset($scope.user.email)
            .then(function(response) {
                UI.showAlert({
                    title: 'Done!',
                    template: 'If your email address is registered with gamebeacon, you will shortly receive instructions to reset your password.'
                })
            })
        }
    };
  }
})();