angular.module('gamebeacon.beacon.card.list.directives', [])

.directive('beaconCardList', [function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			beacons: '=',
		},
		templateUrl: 'app/components/beacon/cardList/cardListView.html'
	}
}]);