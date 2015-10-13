(function() {
	'use strict';

	angular
		.module('gamebeacon.core')
		.factory('InitialData', InitialData);

	InitialData.$inject = ['$q', 'GameType', 'Mission', 'Level', 'Checkpoint', 'Platform', 'Region', 'Mic', 'Resource', 'UI'];

	function InitialData($q, GameType, Mission, Level, Checkpoint, Platform, Region, Mic, Resource, UI) {

		return function() {

			UI.showToast({
				msg: 'loading resources...'
			});

			var gametypes = GameType.list(),
				missions = Mission.list(),
				levels = Level.list(),
				checkpoints = Checkpoint.list(),
				platforms = Platform.list(),
				regions = Region.list(),
				mics = Mic.list();

			return $q.all([gametypes, missions, levels, checkpoints, platforms, regions, mics]).then(function(results) {
				UI.hideToast();
				return {
					gametypes: results[0].results,
					missions: results[1].results,
					levels: results[2].results,
					checkpoints: results[3].results,
					platforms: results[4].results,
					regions: results[5].results,
					mics: results[6].results
				};
			});
		}
	}
})();

/*
.factory('beaconDetailData', [
	'$q',
	'$stateParams',
	'Beacon',
	'ChatService',
	'UI',
	function($q, $stateParams, Beacon, ChatService, UI) {

		return function(beaconId) {

			UI.showToast({
				msg: 'loading beacon...'
			});

			var beacon = Beacon.get(beaconId),
				messages = ChatService.list(beaconId);

			return $q.all([beacon, messages]).then(function(results) {
				UI.hideToast();
				return {
					beacon: results[0],
					messages: results[1].results
				};
			});
		}
	}
])
*/