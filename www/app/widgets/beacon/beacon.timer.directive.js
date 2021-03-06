(function() {
	'use strict';

	angular
		.module('gamebeacon.widgets')
		.directive('beaconTimer', beaconTimer);

	beaconTimer.$inject = ['$interval', 'Beacon'];

	/* @ngInject */
	function beaconTimer($interval, Beacon) {
		// Description:
		//  Creates a new Spinner and sets its options
		// Usage:
		//  <div data-cc-spinner="vm.spinnerOptions"></div>
		var directive = {
			link: link,
			restrict: 'E',
			replace: true,
			scope: {
				beacon: '=',
			},
			templateUrl: 'app/widgets/beacon/beacon.timer.html'
		};
		return directive;

		function link(scope, element, attrs) {
			// timeLeft will be passed in the attrs
			// we need to convert the timeLeft into minites and seconds

			var stop,
				startTimer = function() {
					// Don't start a new timer if we are already running
					if (angular.isDefined(stop)) return;

					// increment the timer
					stop = $interval(function() {
						scope.beacon.timeLeft--
					}, 1000);

				},
				stopTimer = function() {
					// stop the timer
					if (angular.isDefined(stop)) {
						$interval.cancel(stop);
						stop = undefined;
					}
				},
				updateTimer = function() {
					// update the scope variables to update the timer display
					if (scope.beacon.timeLeft > 0) {

						// get total seconds between the times
						var delta = Math.abs(scope.beacon.timeLeft);

						// calculate (and subtract) whole days
						var days = Math.floor(delta / 86400);
						delta -= days * 86400;

						// calculate (and subtract) whole hours
						var hours = Math.floor(delta / 3600) % 24;
						delta -= hours * 3600;

						// calculate (and subtract) whole minutes
						var minutes = Math.floor(delta / 60) % 60;
						delta -= minutes * 60;

						// what's left is seconds
						var seconds = Math.floor(delta % 60); // in theory the modulus is not required

						if (scope.beacon) {
							scope.expired = null
							scope.days = !scope.expired && days > 0 ? days : null;
							scope.hours = !scope.expired && hours > 0 && minutes >= 0 && seconds >= 0 ? hours : null;
							scope.minutes = !scope.expired && minutes > 0 && seconds >= 0 ? pad(minutes) : null;
							scope.seconds = !scope.expired && seconds >= 0 ? pad(seconds) : null;
						}
					} else {
						scope.expired = 'expired'
						scope.days = null;
						scope.hours = null;
						scope.minutes = null;
						scope.seconds = null;
					}
					scope.timeLeft = (scope.days ? scope.days + 'd ' : '') + (scope.hours ? scope.hours + 'h ' : '') + (scope.minutes ? scope.minutes + 'm ' : '') + (scope.seconds ? scope.seconds + 's' : '')
				},
				pad = function(num) {
					// leading zeros for our timer
					return num < 10 ? "0" + num : num
				},
				expireTimer = function() {

				},
				checkExpired = function() {
					if (parseInt(scope.days) <= 0 && parseInt(scope.hours) <= 0 && parseInt(scope.minutes) <= 0 && parseInt(scope.seconds) <= 0) {
						stopTimer();
						scope.expired = true;
						Beacon.expire(scope.beacon);
					}
				};

			// by watching the timeLeft, we can automatically call the update to the display
			scope.$watch('beacon.timeLeft', function(seconds) {
				updateTimer();
				checkExpired();
			});

			scope.$on('$destroy', function() {
				// Make sure that the interval is destroyed too
				stopTimer();
			});

			if (scope.beacon.active) startTimer();
		}
	}

})();
