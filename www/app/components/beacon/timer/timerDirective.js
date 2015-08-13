angular.module('destinybuddy.beacon.timer.directives', [])

.directive('beaconTimer', ['$interval', 'Beacon', function($interval, Beacon) {
	return {
		restrict: 'E',
		scope: {
			beacon: '=',
		},
		templateUrl: 'app/components/beacon/timer/timer.html',
		link: function(scope, elem, attrs) {
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
						if (scope.beacon) {
							scope.minutes = pad(Math.floor(Math.max(0, scope.beacon.timeLeft) / 60));
							scope.seconds = pad(scope.beacon.timeLeft - (scope.minutes * 60));
						}
					} else {
						scope.minutes = 0;
						scope.seconds = 0;
					}
				},
				pad = function(num) {
					// leading zeros for our timer
					return num < 10 ? "0" + num : num
				},
				expireTimer = function() {

				},
				checkExpired = function() {
					if (parseInt(scope.minutes) <= 0 && parseInt(scope.seconds) <= 0) {
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

}])
