(function() {
	"user strict";

	angular
		.module('gamebeacon.widgets')
		.directive('scheduler', scheduler)

	scheduler.$inject = ['$timeout'];

	function scheduler($timeout) {

		var directive = {
			restrict: 'E',
			templateUrl: 'app/widgets/scheduler.html',
			replace: true,
			scope: {},
			require: '?ngModel',
			link: link
		}

		return directive;

		function link(scope, element, attrs, ngModel) {

			if (!ngModel) return; // do nothing if no ng-model

			var today = new Date(),
				minsToStartTime, hoursToStartTime, minsRounded, hoursRounded,
				minsArr = ["00", "10", "20", "30", "40", "50"],
				hoursArr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
				dateSwiper, hoursSwiper, minsSwiper,
				dateLoop = 2, // this will be used to deal with looping swipers and how it affects getting the date value
				swiperOpts = {
					direction: 'vertical',
					slidesPerView: dateLoop,
					centeredSlides: true,
					loop: true,
					onSlideChangeEnd: updateModel
				}

			function addDays(date, days) {
				var result = new Date(date);
				result.setDate(result.getDate() + days);
				return result;
			}

			function formatDay(date) {
				return dayOfWeekAsString(date.getDay()) + ' ' + date.getDate() + ' ' + monthAsString(date.getMonth())
			}

			function dayOfWeekAsString(dayIndex) {
				return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
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

			function translateArrayIndex(swiper, aLen) {

				var start = swiper.activeIndex - dateLoop,
					end = start;

				while (end < 0) {
					end = end + aLen
				}

				return end;

			}

			// update the model
			function updateModel() {

				var today = new Date(),
					days, hours, mins;

				if (dateSwiper && hoursSwiper && minsSwiper) {

					//days = addDays(today, translateArrayIndex(dateSwiper, 15)).toDateString();
					days = new Date(scope.dates[translateArrayIndex(dateSwiper, scope.dates.length)].dateValue).toDateString();

					hours = hoursArr[translateArrayIndex(hoursSwiper, hoursArr.length)];
					mins = minsArr[translateArrayIndex(minsSwiper, minsArr.length)];

					// call $parsers pipeline then update $modelValue
					ngModel.$setViewValue(
						new Date(Date.parse(days + ' ' + hours + ":" + mins)).toISOString()
					);
				}
			}

			scope.dates = [];
			scope.minutes = [];
			scope.hours = [];


			// the date field will be populated with 'Today' and then the next 13 days
			// this is because right now, Parse push only lets you schedule messages up to 14 days in advance
			scope.dates.push({
				dateText: 'Today',
				dateValue: new Date().getTime()
			});

			for (var d = 1; d < 14; d++) {
				var dateToAdd = addDays(today, d);
				scope.dates.push({
					dateText: formatDay(dateToAdd),
					dateValue: dateToAdd
				});
			}

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

			ngModel.$render = function() {

				var initTime = new Date(new Date().getTime() + 30 * 60000);
				// set the default init state of the controls to be 30 mins from now
				minsToStartTime = initTime.getMinutes();
				hoursToStartTime = initTime.getHours();
				minsRounded = (((minsToStartTime + 5) / 10 | 0) * 10) % 60;
				hoursRounded = ((((minsToStartTime / 105) + .5) | 0) + hoursToStartTime) % 24;


				// commented out for now but will need this when we implement edit

				/*				var value = ngModel.$viewValue,
									slideToIdx = 0,
									slideToDuration = 0,
									slideToCb = false;

								if (dateSwiper && hoursSwiper && minsSwiper) {
									if (!value) {
										dateSwiper.slideTo(slideToIdx, slideToDuration, slideToCb);
										hoursSwiper.slideTo(slideToIdx, slideToDuration, slideToCb);
										minsSwiper.slideTo(slideToIdx, slideToDuration, slideToCb);
									} else {
										// set the default init state of the controls to be 30 mins from now
										var minsToStartTime = new Date(ngModel.$viewValue).getMinutes() + 40,
											hoursToStartTime = new Date(ngModel.$viewValue).getHours(),
											minsRounded = (((minsToStartTime + 5) / 10 | 0) * 10) % 60,
											hoursRounded = ((((minsToStartTime / 105) + .5) | 0) + hoursToStartTime) % 24;

										// now we need to set the starting time to be the next available hour/minute slice after now
										dateSwiper.slideTo(daysBetween(new Date(), new Date(ngModel.$viewValue)), slideToDuration, slideToCb);
										hoursSwiper.slideTo(hoursArr.indexOf('' + hoursRounded), slideToDuration, slideToCb);
										minsSwiper.slideTo(minsArr.indexOf('' + minsRounded), slideToDuration, slideToCb);
									}
								}
				*/
			}

			$timeout(function() {

				dateSwiper = new Swiper('.swiper-container.swiper-date', _.extend({
					initialSlide: 0
				}, swiperOpts));

				hoursSwiper = new Swiper('.swiper-container.swiper-time-hours', _.extend({
					initialSlide: hoursArr.indexOf('' + hoursRounded)
				}, swiperOpts));

				minsSwiper = new Swiper('.swiper-container.swiper-time-mins', _.extend({
					initialSlide: minsArr.indexOf('' + minsRounded)
				}, swiperOpts));

				updateModel();

			});
		}
	}


}());
