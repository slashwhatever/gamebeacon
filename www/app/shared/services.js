angular.module('gamebeacon.services', ['ngResource', 'gamebeacon.config'])

.factory('$localStorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		}
	}
}])

.factory('MsgService', [function() {

	return {
		msg: function(msg) {
			var out = '',
				messages = {
					createBeacon: 'Your gamebeacon kicks off in 15 minutes. Have you invited everyone into your game?',
					joinedBeacon: 'A gamebeacon you joined kicks off in 15 minutes. Are you ready to play?'
				};

			try {
				return messages[msg]
			} catch (e) {
				return ''
			}
		}
	}

}])

.factory('LogService', ['$log', function($log) {

	return {
		log: function(message, level) {
			switch (level) {
				case 'error':
					$log.error(message);
					break;
				case 'warn':
					$log.warn(message);
					break;
				case 'info':
					$log.info(message);
					break;
				case 'log':
					$log.log(message);
					break;
				case 'debug':
					$log.debug(message);
					break;
				default:
					$log.debug(message);
			}
		}
	}

}])

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
		getObjectAsFile: function(fileName) {
			return {
				"__type": "File",
				"name": fileName
			}
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

.factory('UIService', [
	'appConfig',
	'$ionicPopup',
	'$rootScope',
	'$ionicLoading',
	function(appConfig, $ionicPopup, $rootScope, $ionicLoading) {
		return {
			showAlert: function(opts, cb) {
				$ionicPopup.alert(opts).then(cb);
			},
			showToast: function(opts) {
				var defs = {
					template: '<div class="loading-spinner"><ion-spinner class="{{cls}}" icon="{{spinner}}"></ion-spinner><span>{{msg}}</span></div>',
					spinner: 'crescent',
					cls: 'spinner-energized',
					msg: 'loading...'
				};

				_.extend(defs, opts);

				defs.template = defs.template.replace('{{spinner}}', defs.spinner);
				defs.template = defs.template.replace('{{msg}}', defs.msg);
				defs.template = defs.template.replace('{{cls}}', defs.cls);

				$ionicLoading.show(defs);
			},
			hideToast: function() {
				$ionicLoading.hide()
			}
		}
	}
])

.service('Mission', [
	'$resource',
	'$q',
	'$cacheFactory',
	'appConfig',
	'ObjectService',
	function($resource, $q, $cacheFactory, appConfig, ObjectService) {

		var cache = $cacheFactory('mission');
		this.missions = [];

		return {
			list: function(params) {
				this.missions = ObjectService.list('missions', {
					cache: cache,
					params: {
						'order': 'order',
						'include': 'levels,checkpoints'
					}
				});
				return this.missions
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.missions.forEach(function(mission) {
					if (mission.objectId === objectId) dfd.resolve(mission)
				})

				return dfd.promise;
			}
		}
	}
])

.service('Level', [
	'$resource',
	'$q',
	'$cacheFactory',
	'appConfig',
	'ObjectService',
	function($resource, $q, $cacheFactory, appConfig, ObjectService) {

		var cache = $cacheFactory('level');
		this.levels = [];

		return {
			list: function(params) {
				this.levels = ObjectService.list('levels', {
					cache: cache
				});
				return this.levels
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.levels.forEach(function(level) {
					if (level.objectId === objectId) dfd.resolve(level)
				})

				return dfd.promise;
			}
		}
	}
])

.service('Image', [
	'$resource',
	'$q',
	'appConfig',
	function($resource, $q, appConfig) {

		var me = this,
			Image = $resource(appConfig.parseRestBaseUrl + 'files/:fileName', {
				fileName: '@fileName'
			}, {
				upload: {
					method: 'POST',
					params: {
						image: '@image'
					},
					headers: _.extend({
						'Content-Type': 'image/jpeg'
					}, appConfig.parseHttpsHeaders)
				}
			});

		return {
			upload: function(image) {

				var d = $q.defer(),
					image = Image.upload({
						fileName: image.replace(/^.*[\\\/]/, ''),
						image: image
					}, function(response) {
						d.resolve(response);
					}, function(error) {
						d.reject(error);
					});

				return d.promise;
			}
		}
	}
])

.service('CheckPoint', [
	'$resource',
	'$q',
	'$cacheFactory',
	'appConfig',
	'ObjectService',
	function($resource, $q, $cacheFactory, appConfig, ObjectService) {

		var cache = $cacheFactory('checkpoint');
		this.checkpoints = [];

		return {
			list: function(params) {
				this.checkpoints = ObjectService.list('checkpoints', {
					cache: cache,
					params: {
						'order': 'order'
					}
				});
				return this.checkpoints
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.checkpoints.forEach(function(checkpoint) {
					if (checkpoint.objectId === objectId) dfd.resolve(checkpoint)
				})

				return dfd.promise;
			}
		}
	}
])

.service('Platform', [
	'$resource',
	'$q',
	'$cacheFactory',
	'appConfig',
	'ObjectService',
	function($resource, $q, $cacheFactory, appConfig, ObjectService) {

		var cache = $cacheFactory('platform');
		this.platforms = [];

		return {
			list: function(params) {
				this.platforms = ObjectService.list('platforms', {
					cache: cache
				});
				return this.platforms
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.platforms.forEach(function(platform) {
					if (platform.objectId === objectId) dfd.resolve(platform)
				})

				return dfd.promise;
			}
		}
	}
])

.service('Region', [
	'$resource',
	'$q',
	'$cacheFactory',
	'appConfig',
	'ObjectService',
	function($resource, $q, $cacheFactory, appConfig, ObjectService) {

		var cache = $cacheFactory('region');
		this.regions = [];

		return {
			list: function(params) {
				this.regions = ObjectService.list('regions', {
					cache: cache
				});
				return this.regions
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.regions.forEach(function(region) {
					if (region.objectId === objectId) dfd.resolve(region)
				})

				return dfd.promise;
			}
		}
	}
])

.service('Mic', [
	'$resource',
	'$q',
	'$cacheFactory',
	'appConfig',
	'ObjectService',
	function($resource, $q, $cacheFactory, appConfig, ObjectService) {

		var cache = $cacheFactory('mic');
		this.mics = [];

		return {
			list: function(params) {
				this.mics = ObjectService.list('mics', {
					cache: cache
				});
				return this.mics
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.mics.forEach(function(mic) {
					if (mic.objectId === objectId) dfd.resolve(mic)
				})

				return dfd.promise;
			}
		}
	}
])

.service('Beacon', [
	'$resource',
	'$q',
	'appConfig',
	'$rootScope',
	'$ionicLoading',
	'UtilsService',
	'PushService',
	'MsgService',
	function($resource, $q, appConfig, $rootScope, $ionicLoading, UtilsService, PushService, MsgService) {

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
			var diff = d - n;
			return Math.floor(diff / 1000); // we want seconds, not ms
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
			beacon.timeLeft = timeLeft(beacon.startDate.iso);
		}

		return {
			list: function(params) {
				var d = $q.defer();

				var beacons = Beacon.list(params, function(response) {

					_.each(response.results, prepareBeaconData);

					/*					// move the active users beacon to the top of the list (if they have one)
										var userBeaconIdx = _.findIndex(response.results, function(i) {
											return i.userIsCreator == true
										});
										if (userBeaconIdx > -1) _.move(response.results, userBeaconIdx, 0);
					*/
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
			updateFireteam: function(beacon, operation, puserId) {

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
						fireteamOnboard: JSON.parse('{"__op":"' + opObj[operation].action + '","objects":[' + JSON.stringify(UtilsService.getObjectAsPointer('pusers', puserId)) + ']}')
					},
					function(response) {

						switch (operation) {
							case 'join':
								PushService.subscribe({
									channel: 'MEMBER' + beacon.objectId,
									puserId: puserId
								});
								break;
							case 'leave':
								PushService.unsubscribe({
									channel: 'MEMBER' + beacon.objectId,
									puserId: puserId
								});
								break;
							case 'kick':
								PushService.unsubscribe({
									channel: 'MEMBER' + beacon.objectId,
									puserId: puserId
								});
								break;
						}

						$ionicLoading.hide();
						d.resolve(response);
					},
					function(error) {
						d.reject(error);
					});
				return d.promise
			}
		}
	}
])

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

.factory('AuthService', ['$resource', '$rootScope', '$ionicLoading', '$localStorage', '$q', 'appConfig', 'PUserService', 'UIService', 'UtilsService', '$cordovaToast', function($resource, $rootScope, $ionicLoading, $localStorage, $q, appConfig, PUserService, UIService, UtilsService, $cordovaToast) {

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
				d.reject('Could not log you in: ' + response.data.error);
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
				UIService.showAlert({
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
				d.reject('Could not log you in: ' + response.data.error);
			});

			return d.promise
		}
	}

}])

.factory('PushService', [
	'appConfig',
	'$http',
	'$resource',
	'LogService',
	'UtilsService',
	function(appConfig, $http, $resource, LogService, UtilsService) {

		var Push = $resource(appConfig.parseRestBaseUrl + 'push/', {}, {
			updateSubscription: {
				url: appConfig.parseRestBaseUrl + 'functions/updateSubscription/',
				method: 'POST',
				headers: appConfig.parseHttpsHeaders
			},
			send: {
				//url: appConfig.parseRestBaseUrl + 'functions/sendPush/',
				method: 'POST',
				headers: appConfig.parseHttpsHeaders,
				transformRequest: function(data, headers) {
					var ret = _.pick(data, 'push_time', 'expiration_time', 'where', 'channels');
					ret.data = {
						'alert': data.alert,
						'badge': 'Increment',
						'title': 'gamebeacon'
					};
					return JSON.stringify(ret);
				}
			}
		});

		return {
			subscribe: function(opts) {

				Push.updateSubscription(_.extend(opts, {
						action: 'sub'
					}),
					function(data, status, headers, config) {
						//alert('iOS registered success = ' + data + ' Status ' + status);
					},
					function(error) {
						//alert('iOS register failure = ' + data + ' Status ' + status);
					});
			},
			unsubscribe: function(opts) {

				Push.updateSubscription(_.extend(opts, {
						action: 'unsub'
					}),
					function(data, status, headers, config) {
						//alert('iOS registered success = ' + data + ' Status ' + status);
					},
					function(error) {
						//alert('iOS register failure = ' + data + ' Status ' + status);
					});
			},
			sendPush: function(opts) {

				Push.send(opts,
					function(data, status, headers, config) {
						//alert('iOS registered success = ' + data + ' Status ' + status);
					},
					function(error) {
						//alert('iOS register failure = ' + data + ' Status ' + status);
					});
			},
			registerPush: function(user) {

				var DEVICE,
					push = PushNotification.init({
						"android": {
							"senderID": "1038280762685"
						},
						"ios": {
							"alert": "true",
							"badge": "true",
							"sound": "true"
						}
					});

				if (ionic.Platform.isAndroid()) DEVICE = 'android';
				else if (ionic.Platform.isIOS()) DEVICE = 'ios';

				push.on('registration', function(data) {
					$http({
						url: 'https://api.parse.com/1/installations',
						method: 'POST',
						data: {
							'deviceType': DEVICE,
							'deviceToken': data.registrationId,
							'installationId': user.installationId,
							'puser': UtilsService.getObjectAsPointer('pusers', user.user_id)
						},
						headers: {
							'X-Parse-Application-Id': appConfig.parseAppKey,
							'X-Parse-REST-API-Key': appConfig.parseRestKey,
							'Content-Type': 'application/json'
						}
					}).success(function(data, status, headers, config) {

					}).error(function(data, status, headers, config) {

					});
				});

				push.on('notification', function(data) {
					UIService.showAlert({
						title: 'gamebeacon',
						template: event.alert
					}, function(res) {
						LogService.log('iOS Message: ' + event.alert);
					});
					// does the notification have a payload?
					if (data.additionalData) {
						console.log('has payload')
					}
				});

				push.on('error', function(e) {
					console.log("push error");
				});

			}
		}
	}
])
