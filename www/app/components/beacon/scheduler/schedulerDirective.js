angular.module('gamebeacon.beacon.scheduler.directives', [])

.directive('beaconScheduler', ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'app/components/beacon/scheduler/schedulerView.html',
		replace: true,
		scope: {},
		require: '?ngModel',
		link: function(scope, elem, attrs, ngModel) {

			if (!ngModel) return; // do nothing if no ng-model

			var today = new Date(),
				minsArr = ["00", "10", "20", "30", "40", "50"],
				hoursArr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
				dateSwiper, hoursSwiper, minsSwiper;

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

			function daysBetween(first, second) {

			    // Copy date parts of the timestamps, discarding the time parts.
			    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
			    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

			    // Do the math.
			    var millisecondsPerDay = 1000 * 60 * 60 * 24;
			    var millisBetween = two.getTime() - one.getTime();
			    var days = millisBetween / millisecondsPerDay;

			    // Round down.
			    return Math.floor(days);
			}

			// update the model
			function updateModel() {

				var today = new Date();

				// call $parsers pipeline then update $modelValue
				ngModel.$setViewValue(
					new Date(
						Date.parse(
							addDays(today, dateSwiper.activeIndex - 1).toDateString() + ' ' + hoursArr[hoursSwiper.activeIndex] + ":" + minsArr[minsSwiper.activeIndex]
						)
					).toISOString()
				);
			}

			scope.dates = [];
			scope.minutes = [];
			scope.hours = [];

			scope.dates.push({
				dateText: 'Today',
				dateValue: new Date().getTime()
			});

			scope.minutes = minsArr.map(function(m) {
				var obj = {};
				obj['minutesText'] = m;
				obj['minutesValue'] = m;
				return obj;
			});

			scope.hours = hoursArr.map(function(h) {
				var obj = {};
				obj['hoursText'] = h;
				obj['hoursValue'] = h;
				return obj;
			});

			for (var d = 0; d < 14; d++) {
				var dateToAdd = addDays(today, d);
				scope.dates.push({
					dateText: formatDay(dateToAdd),
					dateValue: dateToAdd
				});
			}

			$timeout(function() {
				dateSwiper = new Swiper('.swiper-container.swiper-date', {
					direction: 'vertical',
					slidesPerView: 3,
					spaceBetween: 35,
					onSlideChangeEnd: updateModel
				});
				hoursSwiper = new Swiper('.swiper-container.swiper-time-hours', {
					direction: 'vertical',
					slidesPerView: 3,
					spaceBetween: 35,
					onSlideChangeEnd: updateModel
				});
				minsSwiper = new Swiper('.swiper-container.swiper-time-mins', {
					direction: 'vertical',
					slidesPerView: 3,
					spaceBetween: 35,
					onSlideChangeEnd: updateModel
				});

				// set the default init state of the controls to be 30 mins from now
				var minsToStartTime = new Date(ngModel.$viewValue).getMinutes() + 40,
				hoursToStartTime = new Date(ngModel.$viewValue).getHours(),
				minsRounded = (((minsToStartTime + 5) / 10 | 0) * 10) % 60,
				hoursRounded = ((((minsToStartTime / 105) + .5) | 0) + hoursToStartTime) % 24;

				// now we need to set the starting time to be the next available hour/minute slice after now
				if ( ngModel.$viewValue ) dateSwiper.slideTo(daysBetween(new Date(), new Date(ngModel.$viewValue)), 0);
				hoursSwiper.slideTo(hoursArr.indexOf('' + hoursRounded), 0);
				minsSwiper.slideTo(minsArr.indexOf('' + minsRounded), 0);


			});
		}
	};
}])
