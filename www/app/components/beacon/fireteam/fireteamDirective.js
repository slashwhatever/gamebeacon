angular.module('destinybuddy.fireteam.directives', [])

.directive('fireteamMembers', ['UtilsService', function(UtilsService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			fireteam: '=',
			beacon: '=',
			action: '&'
		},
		link: function(scope, elem, attrs) {

			var userIsCreator = scope.beacon.userIsCreator,
			userOnboard = UtilsService.userOnboard(scope.beacon),
			beaconActive = scope.beacon.timeLeft > 0,
			hasSpaces = scope.beacon.fireteamSpaces > 0

			scope.allowJoin = beaconActive && hasSpaces && (!userIsCreator && !userOnboard)

		},
		templateUrl: 'app/components/beacon/fireteam/fireteam.html'
	}

}])
