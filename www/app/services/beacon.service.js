(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Beacon', Beacon);

	Beacon.$inject = ['$resource', '$q', 'appConfig', '$ionicLoading', 'Utils', 'Push', 'Msg', 'UI', 'PUser'];

	function Beacon($resource, $q, appConfig, $ionicLoading, Utils, Push, Msg, UI, PUser) {
		var me = this,
			Beacon = $resource(appConfig.parseRestBaseUrl + 'classes/beacons/:objectId', {
				objectId: '@objectId'
			}, {
				get: {
					headers: appConfig.parseHttpsHeaders,
					params: {
						'include': 'gametype,platform,mission,checkpoint,region,level,creator,fireteamOnboard,mic'
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
						'include': 'gametype,mission,checkpoint,region,platform,level,creator,mic',
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

		me.dirty = false;
		me.beacons = [];

		function addMinutes(date, minutes) {
			return new Date(date.getTime() + minutes * 60000);
		}

		function timeLeft(date) {
			var d = new Date(date).getTime();
			var n = new Date().getTime();
			var diff = d - n;
			return Math.floor(diff / 1000); // we want seconds, not ms
		}

		function prepareBeaconData(beacon) {

			// we're going to move the admin user to the top of the fireteamOnboard list
			_.move(beacon.fireteamOnboard, _.findIndex(beacon.fireteamOnboard, function(i) {
				return i.objectId == beacon.creator.objectId
			}), 0);

			// is the current user the beacon creator?
			beacon['userIsCreator'] = _.findIndex(beacon.fireteamOnboard, function(i) {
				// is the current user the same as the beacon creator user?
				return PUser.getCurrentUser().puserId == beacon.creator.objectId
			}) > -1

			beacon['alreadyOnboard'] = Utils.userOnboard(beacon)

			beacon.platformIcon = Utils.getPlatformIcon(beacon.platform.name);
			beacon.fireteamSpaces = beacon.fireteamRequired - (beacon.fireteamOnboard ? beacon.fireteamOnboard.length - 1 : 0);
			beacon.timeLeft = timeLeft(beacon.startDate.iso);
		}

		function pushUnsubscribeAll( beacon ) {
			// when we delete a beacon, we need to make sure we remove everyone from any push that was created for that beacon

			Push.unsubscribe({
				channel: 'OWNER' + beacon.objectId,
				puserId: PUser.getCurrentUser().puserId
			});


			_.each(beacon.fireteamOnboard, function(f) {
				Push.unsubscribe({
					channel: 'MEMBER' + beacon.objectId,
					puserId: f.objectId
				});
			});

		}


		return {
			list: function(params) {
				var d = $q.defer();

				UI.showToast({
					msg: 'retreiving beacons...'
				});

				Beacon.list(params, function(response) {
					me.beacons = response.results;
					_.each(me.beacons, prepareBeaconData);
					UI.hideToast();
					d.resolve(me.beacons);
				}, function(error) {
					UI.hideToast();
					d.reject(error);
				});

				return d.promise

			},
			get: function(objectId) {
				var d = $q.defer();

				UI.showToast({
					msg: 'retreiving beacon...'
				});

				Beacon.get({
					objectId: objectId
				}, function(response) {
					prepareBeaconData(response);
					UI.hideToast();
					d.resolve(response);
				}, function(error) {
					UI.hideToast();
					d.reject(error);
				});

				return d.promise
			},
			delete: function(beacon) {

				var d = $q.defer();

				me.dirty = true;

				var beacons = Beacon.delete({
					objectId: beacon.objectId
				}, function(response) {

					// unsubscribe the owner and all members from the push notification
					pushUnsubscribeAll(beacon)

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

					pushUnsubscribeAll(beacon)

					d.resolve(response);
				}, function(error) {
					d.reject(error);
				});

				return d.promise
			},
			updateFireteam: function(beacon, operation, puserId) {

				me.dirty = true;

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
						fireteamOnboard: JSON.parse('{"__op":"' + opObj[operation].action + '","objects":[' + JSON.stringify(Utils.getObjectAsPointer('pusers', puserId)) + ']}')
					},
					function(response) {

						switch (operation) {
							case 'join':
								Push.subscribe({
									channel: 'MEMBER' + beacon.objectId,
									puserId: puserId
								});
								break;
							case 'leave':
								Push.unsubscribe({
									channel: 'MEMBER' + beacon.objectId,
									puserId: puserId
								});
								break;
							case 'kick':
								Push.unsubscribe({
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
})();
