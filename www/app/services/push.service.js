(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Push', Push);

	Push.$inject = ['appConfig', '$http', '$resource', 'Log', 'Utils'];

	function Push(appConfig, $http, $resource, Log, Utils) {

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
							'puser': Utils.getObjectAsPointer('pusers', user.user_id)
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
					UI.showAlert({
						title: 'gamebeacon',
						template: event.alert
					}, function(res) {
						Log.log('iOS Message: ' + event.alert);
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
})();