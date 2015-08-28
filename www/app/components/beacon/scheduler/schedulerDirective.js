angular.module('gamebeacon.beacon.scheduler.directives', [])

.directive('scheduler', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/scheduler/scheduler.html',
		link: function(scope, elem, attrs) {

			function addDays(date, days) {
				var result = new Date(date);
				result.setDate(result.getDate() + days);
				return result;
			}

			function formatDay(date) {
				return dayOfWeekAsString(date.getDay()) + ' ' + date.getDate() + ' ' + monthAsString(date.getMonth())
			}

			function dayOfWeekAsString(dayIndex) {
				return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex];
			}

			function monthAsString(monthIndex) {
				return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex];
			}


			var today = new Date(),
				scope.dates = [];
			scope.dates.push('Today');

			for (var d = 0; d < 14; d++) {
				scope.dates.push(formatDay(addDays(today, d)));
			}

		}
	};
}])
