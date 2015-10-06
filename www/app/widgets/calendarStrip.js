(function() {

	"use strict";

	angular
		.module('gamebeacon.widgets')
		.directive('calendarStrip', calendarStrip)

	calendarStrip.$inject = ['$timeout'];

	function calendarStrip($timeout) {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/widgets/calendarStrip.html',
			replace: true,
			scope: {
				changeDate: '&'
			},
			link: link
		};

		return directive;

		function link(scope, elem, attrs, ngModel) {

			var today = new Date(),
				broadcastDate = function(swiper) {
					scope.$emit('updateCalendar', {
						fromDate: new Date(scope.dates[swiper.activeIndex].dateValue)
					});
				},
				minsToStartTime, hoursToStartTime, minsRounded, hoursRounded,
				calendarSwiper,
				dateLoop = 4, // this will be used to deal with looping swipers and how it affects getting the date value
				swiperOpts = {
					direction: 'horizontal',
					/*					not sure i like freeMode
										freeMode: true,
										freeModeSticky: true,
										freeModeMomentum: true,
										freeModeMomentumRatio: 0.25,
					*/
					slidesPerView: dateLoop,
					centeredSlides: true,
					loop: false,
					onSlideChangeEnd: broadcastDate
				};

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

			scope.dates = [];

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

			$timeout(function() {

				calendarSwiper = new Swiper('.swiper-container.swiper-calendar', _.extend({
					initialSlide: 0
				}, swiperOpts));


			});

		}
	}
})()
