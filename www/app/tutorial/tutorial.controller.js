(function() {
	'use strict';

	angular
		.module('gamebeacon.tutorial')
		.controller('Tutorial', Tutorial)

	Tutorial.$inject = ['$scope', '$state', '$ionicSlideBoxDelegate']

	function Tutorial($scope, $state, $ionicSlideBoxDelegate) {

		$scope.quitTutorial = quitTutorial;
		$scope.next = next;
		$scope.previous = previous;
		$scope.slideChanged = slideChanged;

		$scope.$on('$ionicView.beforeEnter', function() {
			$ionicSlideBoxDelegate.slide(0, 0);
		});

		// Called to navigate to the main app
		function quitTutorial() {
			$state.go('app.beacons');
		};

		function next() {
			$ionicSlideBoxDelegate.next();
		};

		function previous() {
			$ionicSlideBoxDelegate.previous();
		};

		// Called each time the slide changes
		function slideChanged(index) {
			$scope.slideIndex = index;
		};
	}
})();
