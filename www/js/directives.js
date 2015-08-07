angular.module('destinybuddy.directives', [])

.directive('tab', function() {
	return {
		restrict: 'E',
		transclude: true,
		require: '^tabset',
		template: '<div role="tabpanel" ng-show="active" ng-transclude class="padding"></div>',
		scope: {
			heading: '@'
		},
		controller: function() {
			//Empty controller so other directives can require being 'under' a tab
		},
		link: function(scope, elem, attr, tabsetCtrl) {
			scope.active = false;
			tabsetCtrl.addTab(scope)
		}
	}
})

.directive('tabset', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		templateUrl: 'templates/fragments/beacon-tabset.html',
		bindToController: true,
		controllerAs: 'tabset',
		controller: function() {
			var self = this;
			self.tabs = [];

			self.addTab = function addTab(tab) {
				self.tabs.push(tab)

				if (self.tabs.length === 1) {
					tab.active = true
				}
			}

			self.select = function(selectedTab) {
				angular.forEach(self.tabs, function(tab) {
					if (tab.active && tab !== selectedTab) {
						tab.active = false;
					}
				})

				selectedTab.active = true;
			}

		}
	}
})

.directive('beaconHeader', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/fragments/beacon-header.html'
	};
}])

.directive('beaconMeta', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/fragments/beacon-meta.html'
	};
}])

.directive('beaconActions', ['UtilsService', function(UtilsService) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/fragments/beacon-actions.html',
    link: function( scope, elem, attrs ) {

      var userIsCreator = scope.beacon.userIsCreator,
	      userHasBeacon = UtilsService.getCurrentUser().myBeacon,
        userOnboard = UtilsService.userOnboard( scope.beacon ),
        beaconActive = scope.beacon.timeLeft > 0,
        hasSpaces = scope.beacon.fireteamSpaces > 0

      scope.allowJoin = !userHasBeacon && (beaconActive && hasSpaces && (!userIsCreator && !userOnboard))
      scope.allowLeave = beaconActive && (!userIsCreator && userOnboard)
      scope.allowDelete = userIsCreator
      scope.allowView = scope.beacons // this cheeky little check will hide the view button in beacon detail view

    }
  };
}])

.directive('fireteamMembers', ['UtilsService', function(UtilsService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			fireteam: '=',
			beacon: '=',
			action: '&'
		},
		link: function(scope, elem, attrs) {

			var userIsCreator = scope.beacon.userIsCreator,
				userOnboard = UtilsService.userOnboard(scope.beacon),
				beaconActive = scope.beacon.timeLeft > 0,
				hasSpaces = scope.beacon.fireteamSpaces > 0

			scope.allowJoin = beaconActive && hasSpaces && (!userIsCreator && !userOnboard)

		},
		templateUrl: 'templates/fragments/fireteam-members.html'
	}

}])

.directive('beaconTimer', ['$interval', 'Beacon', function($interval, Beacon) {
	return {
		restrict: 'E',
		scope: {
			beacon: '=',
		},
		templateUrl: 'templates/fragments/beacon-timer.html',
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

.directive('beaconChat', [function() {
	return {
		restrict: 'AE',
		replace: true,
		require: '^tab',
		templateUrl: 'templates/fragments/beacon-chat.html'
	}
}])

.directive('headerShrink', function($document) {
	var fadeAmt;

	var shrink = function(header, content, amt, max) {
		amt = Math.min(44, amt);
		fadeAmt = 1 - amt / 44;
		ionic.requestAnimationFrame(function() {
			header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
			for (var i = 0, j = header.children.length; i < j; i++) {
				header.children[i].style.opacity = fadeAmt;
			}
		});
	};

	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {
			var starty = $scope.$eval($attr.headerShrink) || 0;
			var shrinkAmt;

			var header = $document[0].body.querySelector('.bar-header');
			var headerHeight = header.offsetHeight;

			$element.bind('scroll', function(e) {
				var scrollTop = null;
				if (e.detail) {
					scrollTop = e.detail.scrollTop;
				} else if (e.target) {
					scrollTop = e.target.scrollTop;
				}
				if (scrollTop > starty) {
					// Start shrinking
					shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
					shrink(header, $element[0], shrinkAmt, headerHeight);
				} else {
					shrink(header, $element[0], 0, headerHeight);
				}
			});
		}
	}
})
