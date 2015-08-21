angular.module('gamebeacon.user.login.controllers', ['gamebeacon.services'])

.controller('LoginController', [
			'$rootScope',
			'$scope',
			'$state',
			'$ionicUser',
			'$ionicPush',
			'UIService',
			'AuthService',
			'PushService',
			function($rootScope, $scope, $state, $ionicUser, $ionicPush, UIService, AuthService, PushService) {

				$scope.user = {
					username: '',
					password: ''
				};

				$scope.login = function(form) {

					AuthService.login($scope.user).then(function(response) {
							//PushService.registerPush(response.puserId)

/*								// register device for push
								$ionicPush.register({
									canShowAlert: false,
									canSetBadge: true,
									canPlaySound: true,
									canRunActionsOnWake: true,
									onNotification: function(notification) {
										return true;
									}
								}, {
									user_id: response.puserId
								});
*/
								$state.go('app.beacons');
							}, function(error) {
								UIService.showAlert({
									title: 'Oops!',
									template: error
								})
							})

						}

						$scope.logout = function(form) {
							$rootScope.currentUser = null
							$state.go('login');
						}

						$scope.requestPasswordReset = function(form) {
							$rootScope.currentUser = null
							$state.go('reset-password');
						}

						// Handles incoming device tokens
						$rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
							$scope.token = data.token;
						});

					}
				])
