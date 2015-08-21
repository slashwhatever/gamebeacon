angular.module('gamebeacon.beacon.actions.directives', [])

.directive('beaconActions', ['UtilsService', function(UtilsService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/actions/actionsView.html',
		link: function( scope, elem, attrs ) {

			var userIsCreator = scope.beacon.userIsCreator,
			userHasBeacon = UtilsService.getCurrentUser().myBeacon,
			userOnboard = UtilsService.userOnboard( scope.beacon ),
			beaconActive = scope.beacon.timeLeft > 0,
			hasSpaces = scope.beacon.fireteamSpaces > 0

			scope.allowJoin = !userHasBeacon && (beaconActive && hasSpaces && (!userIsCreator && !userOnboard))
			scope.allowLeave = beaconActive && (!userIsCreator && userOnboard)
			scope.allowDelete = userIsCreator
			scope.allowView = scope.beacons // this cheeky little check will hide the view button in beacon detail view

		}
	};
}])
