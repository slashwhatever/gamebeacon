angular.module('gamebeacon.fireteam.directives', [])

.directive('fireteamMembers', ['Utils', '$ionicActionSheet', function(Utils, $ionicActionSheet) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/fireteam/fireteam.html',
		scope: {
			fireteam: '=',
			beacon: '=',
			action: '&'
		},
		link: function(scope, elem, attrs) {


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

}])
