(function() {
	"user strict";

	angular
		.module('gamebeacon.widgets')
		.directive('fireteam', fireteam)

	fireteam.$inject = ['Utils', '$ionicActionSheet'];

	function fireteam(Utils, $ionicActionSheet) {

		var directive = {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/widgets/beacon/beacon.fireteam.html',
			scope: {
				fireteam: '=',
				beacon: '=',
				action: '&'
			},
			link: link
		}

		return directive;

		function link(scope, elem, attrs) {


			scope.guardianAction = function(opts) {

				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					destructiveText: 'Kick guardian',
					cancelText: 'Cancel',
					cancel: function() {
						hideSheet();
					},
					destructiveButtonClicked: function() {
						Beacon.updateFireteam(opts.beacon, 'kick', opts.objectId)
						return true;
					}
				});

			};

			var userIsCreator = scope.beacon.userIsCreator,
				userOnboard = Utils.userOnboard(scope.beacon),
				beaconActive = scope.beacon.timeLeft > 0,
				hasSpaces = scope.beacon.fireteamSpaces > 0

			scope.allowJoin = beaconActive && hasSpaces && (!userIsCreator && !userOnboard)

		}
	}

})();
