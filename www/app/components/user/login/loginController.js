angular.module('gamebeacon.user.login.controllers', ['gamebeacon.services'])

.controller('LoginController', [
	'$rootScope',
	'$scope',
	'$state',
	'$ionicUser',
	'$ionicDeploy',
	'$localStorage',
	'UtilsService',
	'UIService',
	'AuthService',
	'PushService',
	function($rootScope, $scope, $state, $ionicUser, $ionicDeploy, $localStorage, UtilsService, UIService, AuthService, PushService) {

		$scope.user = {
			username: '',
			password: ''
		};

		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.checkForUpdates();
		});

		$scope.checkSession = function() {

			UIService.showToast({
				msg: 'attempting auto login'
			});

			var sessionToken = $localStorage.get('sessionToken');
			if ( sessionToken ){

				AuthService.getCurrentUser(sessionToken)
				.then(function(response) {
					UIService.hideToast();
					// user has valid session token - proceed
					$state.go('app.beacons');
				},
					function(error) {
						UIService.hideToast();
						// user needs to login
				})
			}
		}

	  // Update app code with new release from Ionic Deploy
	  $scope.doUpdate = function() {
	  	// Download the updates
	  	$ionicDeploy.download().then(function() {
	  	  // Extract the updates
	  	  $ionicDeploy.extract().then(function() {
	  	    // Load the updated version
	  	    $ionicDeploy.load();
	  	  }, function(error) {
	  	    UIService.showAlert({
	  	    	title: 'Oops!',
	  	    	template: 'Error extracting update. Please try again.'
	  	    })
	  	  }, function(progress) {
	  	    // Do something with the zip extraction progress
	  	    console.log(progress);
	  	  });
	  	}, function(error) {
	  	  UIService.showAlert({
	  	  	title: 'Oops!',
	  	  	template: 'Error downloading update. Please try again.'
	  	  })
	  	}, function(progress) {
	  	  // Do something with the download progress
	  	  console.log(progress);
	  	});
	  };

	  // Check Ionic Deploy for new code
	  $scope.checkForUpdates = function() {

	  	UIService.showToast({
	  		msg: 'checking for updates'
	  	});

	  	// Check for updates
	  	$ionicDeploy.check().then(function(response) {
	  		UIService.hideToast();
	  	  // response will be true/false
	  	  if (response) {
	  	  	var confirmUpdate = $ionicPopup.confirm({
	  	  		title: 'Update available',
	  	  		template: 'Would you like to download and install the latest version of gamebeacon?'
	  	  	});
	  	  	confirmUpdate.then(function(res) {
	  	  		if (res) {
	  	  			$scope.doUpdate()
						}
					})
	  	  } else {
	  	  	$scope.checkSession();
	  	  }
	  	}, function(error) {
	  	  UIService.hideToast();
	  	});
	  }

		$scope.login = function(form) {

			AuthService.login($scope.user).then(function(response) {

				var user = $ionicUser.get();

				if (!user.installationId) {
					user.installationId = $ionicUser.generateGUID();
				}

				_.extend(user, {
					gamertag: response.gamertag,
					user_id: response.puserId,
					username: response.username
				});

				$ionicUser.identify(user);

				if (window.plugins) PushService.registerPush(user)

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

	}
])
