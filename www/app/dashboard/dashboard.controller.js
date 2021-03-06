(function() {
    'use strict';

    angular
        .module('gamebeacon.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$stateParams', 'Utils', 'Beacon', 'PUser'];

    function DashboardController($scope, $stateParams, Utils, Beacon, PUser) {

    	$scope.beacons = [];
    	$scope.currentUser = PUser.getCurrentUser();
    	$scope.noBeacons = null;
    	$scope.moreBeacons = false;
    	$scope.loadingBeacons = null;
    	$scope.refreshBeaconList= refreshBeaconList;
    	$scope.getBeaconChunk= getBeaconChunk;

    	var skip = 0,
    		limit = 20,
    		where = {
	    		'active': true,
	    		'creator': Utils.getObjectAsPointer('pusers', $stateParams.puserId),
	    		'startDate': {
	    			'$gte': {
	    				'__type': "Date",
	    				'iso': new Date(new Date().getTime()).toISOString()
	    			}
	    		}
	    	};

    	$scope.$on('$ionicView.beforeEnter', getBeaconChunk);

    	// go grab 20 beacons from the server
    	function getBeaconChunk(cb) {
    		$scope.loadingBeacons = true;
    		Beacon.list({
    			limit: limit,
    			skip: skip,
    			'where': JSON.stringify(where)
    		}).then(function(response) {

    			$scope.loadingBeacons = false;

    			// if we have results, there may be more...
    			$scope.moreBeacons = (response.length > limit)

    			// increment the skip counter
    			skip += Math.min(response.length, limit);

    			// add the results to the scope
    			if (response.length > 0) {
    				$scope.beacons = $scope.beacons.concat(response);
    				$scope.noBeacons = false;
    			} else {
    				$scope.noBeacons = true;
    				$scope.beacons = null;
    			}

    			$scope.$broadcast('scroll.infiniteScrollComplete');

    			if (cb && typeof cb === 'function') cb.call();

    		});
    	}

    	function refreshBeaconList() {
    		// we need to reset the skip here as we're resetting the list
    		skip = 0;
    		$scope.beacons = [];

    		getBeaconChunk(function() {
    			$scope.$broadcast('scroll.refreshComplete');
    		});

    	}

    }
})();
