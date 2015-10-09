(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Auth', Auth);

	Auth.$inject = ['$resource', '$rootScope', '$ionicLoading', '$localStorage', '$q', 'appConfig', 'PUser', 'UI', 'Utils'];

	function Auth($resource, $rootScope, $ionicLoading, $localStorage, $q, appConfig, PUser, UI, Utils) {

		var User = function(customHeaders) {
			return $resource(appConfig.parseRestBaseUrl + 'login/', {
				puserId: '@puserId',
				userId: '@userId',
				email: '@email'
			}, {
				requestPasswordReset: {
					url: appConfig.parseRestBaseUrl + 'requestPasswordReset',
					method: 'POST',
					params: {
						'email': '@email'
					},
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				},
				getPUser: {
					url: appConfig.parseRestBaseUrl + 'classes/pusers/:puserId',
					method: 'GET',
					params: {
						'include': 'platform,region,mic'
					},
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				},
				login: {
					url: appConfig.parseRestBaseUrl + 'login/',
					method: 'GET',
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				},
				signup: {
					url: appConfig.parseRestBaseUrl + 'functions/signup/',
					method: 'POST',
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				},
				updateUser: {
					url: appConfig.parseRestBaseUrl + 'users/:userId/',
					method: 'PUT',
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				},
				updatePUser: {
					url: appConfig.parseRestBaseUrl + 'pusers/:puserId/',
					method: 'PUT',
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				},
				getCurrentUser: {
					url: appConfig.parseRestBaseUrl + 'users/me',
					method: 'GET',
					headers: _.extend({}, customHeaders, appConfig.parseHttpsHeaders)
				}
			});
		}

		return {
			requestPasswordReset: function(email) {
				var d = $q.defer();

				User().requestPasswordReset({
					email: email
				}, function(userRes) {
					d.resolve();
				});

				return d.promise;
			},
			login: function(user) {
				var d = $q.defer();

				User().login({
					username: user.username,
					password: user.password
				}, function(userRes) {
					if (userRes && userRes.$resolved) {
						if (userRes.emailVerified) {
							User().getPUser({
								puserId: userRes.puser.objectId
							}, function(pUserRes) {
								if (pUserRes && pUserRes.$resolved) {

									var fullUser = {};
									fullUser.userId = userRes.objectId;
									fullUser.puserId = pUserRes.objectId;
									fullUser.username = userRes.username;
									fullUser.gamertag = pUserRes.gamertag;
									fullUser.buddySince = userRes.createdAt;
									fullUser.platform = pUserRes.platform;
									fullUser.picture = pUserRes.picture;
									fullUser.region = pUserRes.region;
									fullUser.mic = pUserRes.mic;
									fullUser.sessionToken = userRes.sessionToken;

									$localStorage.set('sessionToken', userRes.sessionToken)

									$rootScope.currentUser = fullUser

									d.resolve(fullUser);
								}
							})
						} else {
							d.reject('We need you to verify your email address by clicking the link in the email we sent you');
						}
					}
				}, function(response) {
					d.reject('Could not log you in! Got connection?');
				});

				return d.promise;
			},
			signup: function(user) {
				var d = $q.defer();

				User().signup(user, function(user) {
					d.resolve(user);
				}, function(error) {
					d.reject(error);
				});

				return d.promise;

			},
			getFullUser: function() {
				var d = $q.defer();

				$ionicLoading.show({
					template: 'Loading...'
				});

				User().getFullUser({
					objectId: $rootScope.currentUser.puserId
				}, function(response) {
					if (response) {
						$rootScope.currentUser = response;
						$ionicLoading.hide();
						d.resolve(response);
					}
				}, function(response) {
					$ionicLoading.hide();
					UI.showAlert({
						title: 'Oops!',
						template: response.data.error
					})
				});

				return d.promise
			},
			getCurrentUser: function(sessionToken) {
				var d = $q.defer();

				User({
					'X-Parse-Session-Token': sessionToken
				}).getCurrentUser({}, function(userRes) {
					if (userRes && userRes.$resolved) {
						if (userRes.emailVerified) {
							User().getPUser({
								puserId: userRes.puser.objectId
							}, function(pUserRes) {
								if (pUserRes && pUserRes.$resolved) {

									var fullUser = {};
									fullUser.userId = userRes.objectId;
									fullUser.puserId = pUserRes.objectId;
									fullUser.username = userRes.username;
									fullUser.gamertag = pUserRes.gamertag;
									fullUser.buddySince = userRes.createdAt;
									fullUser.platform = pUserRes.platform;
									fullUser.picture = pUserRes.picture;
									fullUser.region = pUserRes.region;
									fullUser.mic = pUserRes.mic;
									fullUser.sessionToken = userRes.sessionToken;
									$localStorage.set('sessionToken', userRes.sessionToken)

									$rootScope.currentUser = fullUser;

									d.resolve(fullUser);
								}
							})
						} else {
							d.reject('We need you to verify your email address by clicking the link in the email we sent you');
						}
					}
				}, function(response) {
					d.reject('Could not log you in! Got connection?');
				});

				return d.promise
			}
		}
	}
})();