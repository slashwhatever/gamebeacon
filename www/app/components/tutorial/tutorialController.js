angular.module('destinybuddy.tutorial.controllers', ['destinybuddy.services'])

.controller('TutorialController', function($scope, $state, $ionicSlideBoxDelegate) {

	// Called to navigate to the main app
	$scope.quitTutorial = function() {
		$state.go('app.beacons');
	};

	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};

	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};

	// Called each time the slide changes
	$scope.slideChanged = function(index) {
		$scope.slideIndex = index;
	};
});
