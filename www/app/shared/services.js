angular.module('destinybuddy.services', ['ngResource', 'destinybuddy.config'])

.factory('UtilsService', ['appConfig', '$rootScope', function(appConfig, $rootScope) {
	var funcs = {
		userOnboard: function(beacon) {
			return _.findIndex(beacon.fireteamOnboard, function(i) {
				// is the current user in the list of fireteam members?
				return i ? funcs.getCurrentUser().puserId == i.objectId : false
			}) > -1
		},
		findMyBeacon: function(beacons) {
			var isCreator = _.findWhere(beacons, {
				userIsCreator: true
			});
			var isOnboard = _.findWhere(beacons, {
				alreadyOnboard: true,
				userIsCreator: false
			});

			return isCreator || isOnboard || undefined
		},
		getObjectAsPointer: function(className, objectId) {
			return {
				"__type": "Pointer",
				"className": className,
				"objectId": objectId
			}
		},
		getMyBeacon: function() {
			return $rootScope.currentUser.myBeacon
		},
		getCurrentUser: function() {
			return $rootScope.currentUser
		},
		getPlatformIcon: function(platform) {
			switch (platform.toLowerCase()) {
				case 'playstation 3':
					return 'ion-playstation ps3';
					break;

				case 'playstation 4':
					return 'ion-playstation ps4';
					break;

				case 'xbox one':
					return 'ion-xbox one';
					break;

				case 'xbox 360':
					return 'ion-xbox 360';
					break;
			}
		}
	};

	return funcs
}])

.factory('UIService', ['appConfig', '$ionicPopup', '$rootScope', function(appConfig, $ionicPopup, $rootScope) {
	return {
		showAlert: function(opts, cb) {
			$ionicPopup.alert(opts).then(cb);
		}
	}
}])

.service('Beacon', ['$resource', '$q', 'appConfig', '$rootScope', '$ionicLoading', 'UtilsService', function($resource, $q, appConfig, $rootScope, $ionicLoading, UtilsService) {

	var me = this,
		Beacon = $resource(appConfig.parseRestBaseUrl + 'classes/beacons/:objectId', {
			objectId: '@objectId'
		}, {
			get: {
				headers: appConfig.parseHttpsHeaders,
				params: {
					'include': 'platform,mission,checkpoint,region,level,creator,fireteamOnboard,mic'
				}
			},
			delete: {
				method: 'DELETE',
				headers: appConfig.parseHttpsHeaders
			},
			list: {
				method: 'GET',
				headers: appConfig.parseHttpsHeaders,
				params: {
					'include': 'mission,checkpoint,region,platform,level,creator,mic',
					'order': '-createdAt',
					'limit': '@limit',
					'skip': '@skip',
					'where': '@where'
				}
			},
			save: {
				method: 'POST',
				headers: appConfig.parseHttpsHeaders
			},
			update: {
				method: 'PUT',
				headers: appConfig.parseHttpsHeaders
			},
			updateFireteam: {
				method: 'PUT',
				headers: _.extend({
					'Content-Type': 'application/json'
				}, appConfig.parseHttpsHeaders),
				params: {
					fireteamOnboard: '@fireteamOnboard'
				}
			}
		});

	var addMinutes = function(date, minutes) {
		return new Date(date.getTime() + minutes * 60000);
	}

	var timeLeft = function(date) {
		var d = new Date(date).getTime();
		var n = new Date().getTime();
		var diff = n - d;
		var halfHour = (30 * 60 * 1000);

		return (diff > halfHour) ? 0 : Math.round((halfHour - diff) / 1000);

	}

	var prepareBeaconData = function(beacon) {

		// we're going to move the admin user to the top of the fireteamOnboard list
		_.move(beacon.fireteamOnboard, _.findIndex(beacon.fireteamOnboard, function(i) {
			return i.objectId == beacon.creator.objectId
		}), 0);

		// is the current user the beacon creator?
		beacon['userIsCreator'] = _.findIndex(beacon.fireteamOnboard, function(i) {
			// is the current user the same as the beacon creator user?
			return UtilsService.getCurrentUser().puserId == beacon.creator.objectId
		}) > -1

		beacon['alreadyOnboard'] = UtilsService.userOnboard(beacon)

		beacon.platformIcon = UtilsService.getPlatformIcon(beacon.platform.name);
		beacon.fireteamSpaces = beacon.fireteamRequired - (beacon.fireteamOnboard ? beacon.fireteamOnboard.length - 1 : 0);
		beacon.timeLeft = timeLeft(beacon.createdAt);
	}

	return {
		list: function(params) {
			var d = $q.defer();

			var beacons = Beacon.list(params, function(response) {

				_.each(response.results, prepareBeaconData);

				// move the active users beacon to the top of the list (if they have one)
				var userBeaconIdx = _.findIndex(response.results, function(i) {
					return i.userIsCreator == true
				});
				if (userBeaconIdx > -1) _.move(response.results, userBeaconIdx, 0);

				d.resolve(response);
			}, function(error) {
				d.reject(error);
			});

			return d.promise
		},
		get: function(objectId) {
			var d = $q.defer(),
				beacon,
				beacons = Beacon.get({
					objectId: objectId
				}, function(response) {

					beacon = response;
					prepareBeaconData(beacon);
					d.resolve(response);
				}, function(error) {
					d.reject(error);
				});

			return d.promise
		},
		delete: function(beacon) {
			var d = $q.defer();

			var beacons = Beacon.delete({
				objectId: beacon.objectId
			}, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error);
			});

			return d.promise
		},
		save: function(beacon) {
			var d = $q.defer();

			var beacons = Beacon.save(beacon, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error);
			});

			return d.promise
		},
		expire: function(beacon) {
			var d = $q.defer();

			Beacon.update({
				objectId: beacon.objectId,
				active: false
			}, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error);
			});

			return d.promise
		},
		updateFireteam: function(beacon, operation) {

			var d = $q.defer(),
				opObj = {
					'join': {
						'loadMsg': 'Joining fireteam...',
						'successMsg': 'You joined the team. Please add the user to your friends list and enjoy your game!',
						'failMsg': 'Oops! Looks like there was a problem joining the team. Try again.',
						'action': 'AddUnique'
					},
					'leave': {
						'loadMsg': 'Leaving fireteam...',
						'successMsg': 'You left the fireteam.',
						'failMsg': 'Oops! Looks like there was a problem leaving the team. Try again.',
						'action': 'Remove'
					},
					'kick': {
						'loadMsg': 'Kicking guardian...',
						'successMsg': 'You kicked the guradian.',
						'failMsg': 'Oops! Looks like there was a problem kicking the guardian. Try again.',
						'action': 'Remove'
					}
				};

			$ionicLoading.show({
				template: opObj[operation].loadMsg
			});

			Beacon.updateFireteam({
					objectId: beacon.objectId,
					fireteamOnboard: JSON.parse('{"__op":"' + opObj[operation].action + '","objects":[' + JSON.stringify(UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.puserId)) + ']}')
				},
				function(response) {
					$ionicLoading.hide();
					d.resolve(response);
				},
				function(error) {
					d.reject(error);
				});
			return d.promise
		}
	}
}])

.factory('Level', ['$resource', 'appConfig', function($resource, appConfig) {
	return $resource(appConfig.parseRestBaseUrl + 'classes/levels/:id', {}, {
		list: {
			method: 'GET',
			headers: appConfig.parseHttpsHeaders
		}
	});
}])

.factory('ObjectService', ['$resource', '$q', '$ionicLoading', 'appConfig', function($resource, $q, $ionicLoading, appConfig) {

	var Objects = function(obj) {
		return $resource(appConfig.parseRestBaseUrl + 'classes/:objectName/:objectId', {
			objectName: '@objectName',
			objectId: '@objectId',
			where: '@where'
		}, {
			get: _.extend({}, {
				headers: appConfig.parseHttpsHeaders
			}, obj),
			list: _.extend({}, {
				method: 'GET',
				headers: appConfig.parseHttpsHeaders
			}, obj),
			save: _.extend({}, {
				method: 'POST',
				headers: appConfig.parseHttpsHeaders
			}, obj),
			update: _.extend({}, {
				method: 'PUT',
				headers: appConfig.parseHttpsHeaders
			}, obj)
		});
	}

	return {
		list: function(objectName, obj) {
			var d = $q.defer();
			Objects(obj).list({}, {
				objectName: objectName
			}, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error)
			});
			return d.promise
		},
		get: function(objectName, objectId, obj) {
			var d = $q.defer();
			Objects(obj).get({}, {
				objectName: objectName,
				objectId: objectId
			}, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error)
			});
			return d.promise

		},
		save: function(obj) {

			var d = $q.defer();
			Objects(obj).save({}, {
				objectName: objectName
			}, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error)
			});
			return d.promise
		},
		update: function(objectName, objectId, obj) {
			var d = $q.defer();

			var d = $q.defer();
			Objects(obj).update(params, {
				objectName: objectName,
				objectId: objectId
			}, function(response) {
				d.resolve(response);
			}, function(error) {
				d.reject(error)
			});
			return d.promise

		}
	}

}])

.factory('AuthService', ['$resource', '$rootScope', '$ionicLoading', '$q', 'appConfig', 'PUserService', 'UIService', 'UtilsService', '$cordovaToast', function($resource, $rootScope, $ionicLoading, $q, appConfig, PUserService, UIService, UtilsService, $cordovaToast) {

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
					'include': 'platform,region'
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
			updateProfile: {
				url: appConfig.parseRestBaseUrl + 'functions/updateProfile/',
				method: 'PUT',
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
								fullUser.region = pUserRes.region;
								fullUser.sessionToken = userRes.sessionToken;

								$rootScope.currentUser = fullUser

					      d.resolve(fullUser);
							}
						})
					} else {
						d.reject('We need you to verify your email address by clicking the link in the email we sent you');
					}
				}
			}, function( response ) {
				d.reject('Could not log you in: ' + response.data.error);
			});

			return d.promise;
		},
		signup: function(user) {
			var d = $q.defer();

			User().signup({
				username: user.username,
				gamertag: user.gamertag,
				email: user.email,
				password: user.password,
				confirmPassword: user.confirmPassword,
				platform: UtilsService.getObjectAsPointer('platforms', user.platform.objectId),
				region: UtilsService.getObjectAsPointer('regions', user.region.objectId)
			}, function(user) {
				d.resolve(user);
			}, function(error) {
				d.reject(error);
			});

			return d.promise;

		},
		updateProfile: function(user) {
			var d = $q.defer(),
				user, PUser, puser;

			User({
				'X-Parse-Session-Token': $rootScope.currentUser.sessionToken
			}).updateUser({
				username: user.username
			}, {
				userId: user.userId
			}, function(response) {
				if (response && response.updatedAt) {
					PUserService.update({
						gamertag: user.gamertag,
						platform: UtilsService.getObjectAsPointer('platforms', user.platform.objectId),
						region: UtilsService.getObjectAsPointer('regions', user.region.objectId)
					}, {
						id: user.puserId
					}, function(response) {
						d.resolve(response);
					}, function(error) {
						d.reject(error);
					});
				}
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
				UIService.showAlert({
					title: 'Oops!',
					template: response.data.error
				})
			});

			return d.promise
		},
		getCurrentUser: function() {
			var d = $q.defer();

			User({
				'X-Parse-Session-Token': $rootScope.currentUser.sessionToken
			}).getCurrentUser({}, function(response) {
				if (response) {
					d.resolve(response);
				}
			}, function(response) {
				UIService.showAlert({
					title: 'Oops!',
					template: response.data.error
				})
			});

			return d.promise
		}
	}

}])
