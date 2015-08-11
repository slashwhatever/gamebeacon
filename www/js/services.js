angular.module('destinybuddy.services', ['ngResource', 'destinybuddy.config'])

.factory('UtilsService', ['appConfig', '$rootScope', function(appConfig, $rootScope) {
	return {
		userOnboard: function(beacon) {
			return _.findIndex(beacon.fireteamOnboard, function(i) {
				// is the current user in the list of fireteam members?
				return $rootScope.currentUser.objectId == i.objectId
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
	}
}])

.factory('UIService', ['appConfig', '$ionicPopup', '$rootScope', function(appConfig, $ionicPopup, $rootScope) {
	return {
		showAlert: function(opts, cb) {
			$ionicPopup.alert(opts).then(cb);
		}
	}
}])

.service('Beacon', ['$resource', '$q', 'appConfig', '$rootScope', '$ionicLoading', '$cordovaToast', 'UtilsService', function($resource, $q, appConfig, $rootScope, $ionicLoading, $cordovaToast, UtilsService) {

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
					'where': '{"active":true}'
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
			return UtilsService.getCurrentUser().objectId == beacon.creator.objectId
		}) > -1

		beacon['alreadyOnboard'] = _.findIndex(beacon.fireteamOnboard, function(i) {
			// is the current user in the list of fireteam members?
			return UtilsService.getCurrentUser().objectId == i.objectId
		}) > -1

		beacon.platformIcon = UtilsService.getPlatformIcon(beacon.platform.name);
		beacon.fireteamSpaces = beacon.fireteamRequired - (beacon.fireteamOnboard ? beacon.fireteamOnboard.length - 1 : 0);
		beacon.timeLeft = timeLeft(beacon.createdAt);
	}

	return {
		list: function(params) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Refreshing beacons...'
			});

			var beacons = Beacon.list(params, function(response) {

				_.each(response.results, prepareBeaconData);

				// move the active users beacon to the top of the list (if they have one)
				var userBeaconIdx = _.findIndex(response.results, function(i) {
					return i.userIsCreator == true
				});
				if (userBeaconIdx > -1) _.move(response.results, userBeaconIdx, 0);

				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});

			return d.promise
		},
		get: function(objectId) {
			var d = $q.defer(),
				beacon;

			$ionicLoading.show({
				template: 'Getting beacon...'
			});

			var beacons = Beacon.get({
				objectId: objectId
			}, function(response) {

				beacon = response;

				prepareBeaconData(beacon);

				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});

			return d.promise
		},
		delete: function(beacon) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Deleting beacon...'
			});

			var beacons = Beacon.delete({
				objectId: beacon.objectId
			}, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});

			return d.promise
		},
		save: function(beacon) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Saving beacon...'
			});

			var beacons = Beacon.save(beacon, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});

			return d.promise
		},
		expire: function(beacon) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Expiring beacon...'
			});

			Beacon.update({
				objectId: beacon.objectId,
				active: false
			}, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
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
					fireteamOnboard: JSON.parse('{"__op":"' + opObj[operation].action + '","objects":[' + JSON.stringify(UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.objectId)) + ']}')
				},
				function(response) {
					$ionicLoading.hide();
					//$cordovaToast.showShortCenter( opObj.successMsg )
					d.resolve(response);
				},
				function() {
					//$cordovaToast.showShortCenter( opObj.failMsg )
					$ionicLoading.hide();
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

	var Objects = $resource(appConfig.parseRestBaseUrl + 'classes/:objectName/:objectId', {
		objectName: '@objectName',
		objectId: '@objectId'
	}, {
		get: {
			headers: appConfig.parseHttpsHeaders
		},
		list: {
			method: 'GET',
			headers: appConfig.parseHttpsHeaders
		},
		save: {
			method: 'POST',
			headers: appConfig.parseHttpsHeaders
		},
		update: {
			method: 'PUT',
			headers: appConfig.parseHttpsHeaders
		}
	});

	return {
		list: function(objectName) {
			var d = $q.defer();
			$ionicLoading.show({
				template: 'Loading...'
			});
			var objects = Objects.list({
				objectName: objectName
			}, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		get: function(objectName, objectId) {
			var d = $q.defer();
			$ionicLoading.show({
				template: 'Loading...'
			});

			var object = Objects.get({
				objectName: objectName,
				objectId: objectId
			}, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		save: function() {
			var d = $q.defer();
			$ionicLoading.show({
				template: 'Loading...'
			});

			var object = Objects.save({
				objectName: objectName
			}, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		update: function(object) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});
			var object = Objects.update(object, function(response) {
				$ionicLoading.hide();
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		}
	}

}])

.factory('MissionService', ['$resource', '$q', '$ionicLoading', 'appConfig', function($resource, $q, $ionicLoading, appConfig) {

	var Missions = $resource(appConfig.parseRestBaseUrl + 'classes/missions/:missionId', {
		missionId: '@missionId'
	}, {
		get: {
			headers: appConfig.parseHttpsHeaders
		},
		list: {
			method: 'GET',
			headers: appConfig.parseHttpsHeaders,
			params: {
				'order': 'order',
				'include': 'levels,checkpoints'
			}
		},
		save: {
			method: 'POST',
			headers: appConfig.parseHttpsHeaders
		},
		update: {
			method: 'PUT',
			headers: appConfig.parseHttpsHeaders
		}
	});

	return {
		list: function() {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var missions = Missions.list({}, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide()
			});
			return d.promise
		},
		get: function(missionId) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var mission = Missions.get({
				missionId: missionId
			}, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		save: function() {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var mission = Missions.save({}, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		update: function(mission) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var mission = Missions.update(mission, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		}
	}
}])

.factory('CheckpointService', ['$resource', '$q', '$ionicLoading', 'appConfig', function($resource, $q, $ionicLoading, appConfig) {

	var Resource = $resource(appConfig.parseRestBaseUrl + 'classes/checkpoints/:checkpointId', {
		checkpointId: '@checkpointId'
	}, {
		get: {
			headers: appConfig.parseHttpsHeaders
		},
		list: {
			method: 'GET',
			headers: appConfig.parseHttpsHeaders,
			params: {
				'order': 'order'
			}
		},
		save: {
			method: 'POST',
			headers: appConfig.parseHttpsHeaders
		},
		update: {
			method: 'PUT',
			headers: appConfig.parseHttpsHeaders
		}
	});

	return {
		list: function() {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var checkpoints = Resource.list({}, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide()
			});
			return d.promise
		},
		get: function(checkpointId) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var checkpoint = Resource.get({
				checkpointId: checkpointId
			}, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		save: function() {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var checkpoint = Resource.save({}, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		},
		update: function(mission) {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			var checkpoint = Resource.update(checkpoint, function(response) {
				$ionicLoading.hide()
				d.resolve(response);
			}, function() {
				$ionicLoading.hide();
			});
			return d.promise
		}
	}
}])

.factory('ChatService', ['$rootScope', '$resource', '$q', 'appConfig', 'UtilsService', function($rootScope, $resource, $q, appConfig, UtilsService) {

	var Messages = $resource(appConfig.parseRestBaseUrl + 'classes/messages/:messageId', {
		messageId: '@messageId',
		beaconId: '@beaconId',
		where: '@where'
	}, {
		get: {
			headers: appConfig.parseHttpsHeaders
		},
		list: {
			method: 'GET',
			headers: appConfig.parseHttpsHeaders,
			params: {
				'where': '@where',
				'order': '-createdAt',
				'include': 'from,to,mission,createdAt'
			}
		},
		save: {
			url: appConfig.parseRestBaseUrl + 'classes/messages/:message/:beacon',
			method: 'POST',
			headers: appConfig.parseHttpsHeaders
		},
		update: {
			method: 'PUT',
			headers: appConfig.parseHttpsHeaders
		}
	});

	return {
		list: function(beaconId) {
			var d = $q.defer();

			var messages = Messages.list({
				where: '{"beacon":{"__type":"Pointer","className":"beacons","objectId":"' + beaconId + '"}}'
			}, function(response) {
				d.resolve(response);
			});
			return d.promise
		},
		get: function(messageId) {
			var d = $q.defer();

			var message = Messages.get({
				messageId: messageId
			}, function(response) {
				d.resolve(response);
			});
			return d.promise
		},
		save: function(message, beaconId) {
			var d = $q.defer();

			var messages = Messages.save({
				message: message,
				beacon: UtilsService.getObjectAsPointer('beacons', beaconId),
				from: UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.objectId)
			}, function(response) {
				d.resolve(response);
			});
			return d.promise
		},
		update: function(message) {
			var d = $q.defer();

			var messages = Messages.update(messages, function(response) {
				d.resolve(response);
			});
			return d.promise
		}
	}
}])

.factory('AuthService', ['$resource', '$rootScope', '$ionicLoading', '$q', 'appConfig', 'UIService', 'UtilsService', '$cordovaToast', function($resource, $rootScope, $ionicLoading, $q, appConfig, UIService, UtilsService, $cordovaToast) {


/*	return function(customHeaders){
    return $resource('/api/user', {}, {
      connect: {
        method: 'POST',
        params: {},
        isArray: false,
        headers: customHeaders
      }
    });
  };
*/

	var customHeaders = function() {
			var user = UtilsService.getCurrentUser()
			return user ? user.sessionToken : null
		},
		User = $resource(appConfig.parseRestBaseUrl + 'login/', {
			puserId: '@puserId'
		}, {
			getPUser: {
				url: appConfig.parseRestBaseUrl + 'classes/pusers/:puserId',
				method: 'GET',
				headers: appConfig.parseHttpsHeaders,
				params: {
					'include': 'platform,region'
				}
			},
			login: {
				url: appConfig.parseRestBaseUrl + 'login/',
				method: 'GET',
				headers: appConfig.parseHttpsHeaders
			},
			signup: {
				url: appConfig.parseRestBaseUrl + 'functions/signup/',
				method: 'POST',
				headers: appConfig.parseHttpsHeaders
			},
			updateProfile: {
				url: appConfig.parseRestBaseUrl + 'functions/updateProfile/',
				method: 'POST',
				headers: appConfig.parseHttpsHeaders
			},
			getCurrentUser: {
				url: appConfig.parseRestBaseUrl + 'users/me',
				method: 'GET',
				headers: _.extend({
					'X-Parse-Session-Token': customHeaders()
				}, appConfig.parseHttpsHeaders)
			}
		});

	return {
		login: function(user) {
			var d = $q.defer();

			User.login({
				username: user.username,
				password: user.password
			}, function(userRes) {
				if (userRes && userRes.$resolved) {
					if (userRes.emailVerified) {
						User.getPUser({
							puserId: userRes.puser.objectId
						}, function(pUserRes) {
							if (pUserRes && pUserRes.$resolved) {

								var fullUser = {};
								fullUser.objectId = pUserRes.objectId;
								fullUser.username = userRes.username;
								fullUser.gamertag = pUserRes.gamertag;
								fullUser.buddySince = userRes.createdAt;
								fullUser.platform = pUserRes.platform;
								fullUser.region = pUserRes.region;

								$rootScope.currentUser = fullUser
								d.resolve(fullUser);
							}
						})
					} else {
						UIService.showAlert({
							title: 'Oops!',
							template: 'We need you to verify your email address by clicking the link in the email we sent you'
						})
					}
				}
			}, function(errRes) {
				UIService.showAlert({
					title: 'Login failed',
					template: errRes.data.error
				})
			});

			return d.promise;
		},
		signup: function(user) {
			var d = $q.defer();

			User.signup({
				username: user.username,
				gamertag: user.gamertag,
				email: user.email,
				password: user.password,
				confirmPassword: user.confirmPassword,
				platform: UtilsService.getObjectAsPointer('platforms', user.platform.objectId),
				region: UtilsService.getObjectAsPointer('regions', user.region.objectId)
			}, function(user) {
				d.resolve(user);
			}, function(response) {
				$cordovaToast.showShortCenter(response.data.error)
			});

			return d.promise;

		},
		updateProfile: function(user) {
			var d = $q.defer(), user, PUser, puser;

			user = User.getCurrentUser({}, function(response){

				user.set("username", user.username);
				user.save(user.objectId, {
					success: function(user) {
						ObjectService.update('pusers', user.puser.objectId, {
							'platform': user.platform,
							'region': user.region
						}, function(response){
							UIService.showAlert({title: 'Done!', template: 'User details updated.'})
						},
						function(error){
							UIService.showAlert({title: 'Oops!', template: 'Could not update user details. Try again.'})
						});
					}
				});
			}, function(error){
				UIService.showAlert({title: 'Oops!', template: 'Could not get user details. Try again.'})
			});

			return d.promise;

		},
		getFullUser: function() {
			var d = $q.defer();

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.getFullUser({
				objectId: $rootScope.currentUser.objectId
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

			User.getCurrentUser($rootScope.currentUser.sessionToken, function(response) {
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
