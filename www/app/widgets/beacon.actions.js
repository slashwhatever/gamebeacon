(function(){

	"use strict";

	angular
		.module('gamebeacon.widgets')
		.directive('beaconActions', beaconActions)

		beaconActions.$inject = ['UtilsService'];

		function beaconActions(UtilsService) {
			 var directive = {
			 		restrict: 'E',
			 		replace: true,
			 		templateUrl: 'app/widgets/beacon.actions.html',
			 		link: link
			 	};

			 return directive;

			 function link( scope, elem, attrs ) {

			 			var userIsCreator = scope.beacon.userIsCreator,
			 			userOnboard = UtilsService.userOnboard( scope.beacon ),
			 			beaconActive = scope.beacon.timeLeft > 0,
			 			hasSpaces = scope.beacon.fireteamSpaces > 0

			 			scope.allowJoin = beaconActive && hasSpaces && (!userOnboard && !userIsCreator)
			 			scope.allowLeave = beaconActive && (!userIsCreator && userOnboard)
			 			scope.allowDelete = userIsCreator
			 			scope.allowView = scope.beacons // this cheeky little check will hide the view button in beacon detail view

			 		}

		}
})();


