angular.module('destinybuddy.controllers', ['destinybuddy.services'])

.controller('UserController', ['$rootScope', '$scope', 'UtilsService', function($rootScope, $scope, UtilsService) {

  $scope.profile = {
    platformIcon: UtilsService.getPlatformIcon($scope.currentUser.platform.name)
  }

  _.extend($scope.profile, $rootScope.currentUser)

}])

.controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService', function($rootScope, $scope, $state, AuthService) {

  $scope.user = {
    username: '',
    password: ''
  };

  $scope.login = function(form) {
    AuthService.login($scope.user).then(function(response) {
      $state.go('app.beacons');
    })
  }

  $scope.logout = function(form) {
    $rootScope.currentUser = null
    $state.go('login');
  }

}])

.controller('SignupController', ['$rootScope', '$scope', '$state', 'platforms', 'regions', 'AuthService', 'UIService', 'UtilsService', function($rootScope, $scope, $state, platforms, regions, AuthService, UIService, UtilsService) {

  $scope.platforms = platforms.results;
  $scope.regions = regions.results;

  $scope.user = {
    username: '',
    email: '',
    password: '',
    gamertag: '',
    platform: '',
    region: ''
  };

  $scope.register = function() {
    AuthService.signup($scope.user)
    .then(function(response) {
      if (response && response.$resolved) {
        UIService.showAlert({
          title: 'Success!',
          template: 'Now we need you to go click the confirmation link in the email we just sent you....please :)'
      }, function() {
        $state.go('login')
      })
      } else {
        UIService.showAlert({
          title: 'Failed!',
          template: 'Looks like there was a problem signing you up. Try again.'
        })
      }
    }, function(error) {
      $scope.showSignupResult({
        title: 'Failed!',
        template: error.message
      })
    })
  };

}])

.controller('ListBeaconsController', ['$scope', '$rootScope', '$state', '$ionicPopup', 'Beacon', 'UtilsService', function($scope, $rootScope, $state, $ionicPopup, Beacon, UtilsService) {

  $scope.myBeacon = null;
  $scope.beacons = [];
  $scope.skip = 0;
  $scope.limit = 20;
  $scope.moreBeacons = false;
  $scope.floatButton = {
    label : $scope.myBeacon ? 'Create beacon' : 'My beacon',
    icon : $scope.myBeacon ? 'ion-compose' : 'ion-radio-waves',
  }

  // go grab 20 beacons from the server
  $scope.getBeaconChunk = function() {
    Beacon.list({ limit : $scope.limit, skip : $scope.skip}).then(function(response) {

      // if we have results, there may be more...
      $scope.moreBeacons = ( response.results.length > $scope.limit )

      // increment the skip counter
      $scope.skip += Math.min(response.results.length, $scope.limit);

      // add the results to the scope
      if ( response.results.length > 0 ) $scope.beacons = $scope.beacons.concat(response.results);
      else $scope.beacons = null;

      // call a stop to the infinite scroll
      $scope.$broadcast('scroll.infiniteScrollComplete');

    });
  }

  $scope.refreshBeaconList = function() {
    Beacon.list().then(function(response) {

      // we need to reset the skip here as we're resetting the list
      $scope.skip = 0;

      $scope.beacons = response.results.length > 0 ? response.results : null;

      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.joinBeacon = function(beacon) {
    Beacon.updateFireteam(beacon, 'join').then(function() {
      $scope.myBeacon = beacon.objectId;
      $state.go('app.beacon', {
        beaconId: beacon.objectId
      }, {
        reload: true,
        notify: true
      });
    });
  }

  $scope.deleteBeacon = function(beacon) {
    var confirmDel = $ionicPopup.confirm({
      title: 'Delete beacon',
      template: 'Are you sure you want to delete your beacon?'
    });
    confirmDel.then(function(res) {
      if (res) {
        Beacon.delete(beacon).then(function() {
          $scope.myBeacon = null;
          $state.go('app.beacons', null, {
            reload: true,
            notify: true
          });
        });
      }
    });
  }

  $scope.leaveBeacon = function(beacon) {
    Beacon.updateFireteam(beacon, 'leave').then(function() {
      $scope.myBeacon = null;
      $state.go('app.beacons', null, {
        reload: true,
        notify: true
      });
    });
  }

  $scope.getBeaconChunk();

  // watches

  $scope.$watch('beacons', function() {
    $scope.myBeacon = UtilsService.findMyBeacon($scope.beacons);
  });

  // when myBeacon changes, update the currentUser being held on $rootScope
  $scope.$watch('myBeacon', function() {
    $rootScope.currentUser.myBeacon = $scope.myBeacon;
  });

}])

.controller('GetBeaconController', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', '$interval', '$ionicActionSheet', 'beacon', 'messages', 'ChatService', 'UtilsService', 'Beacon', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $interval, $ionicActionSheet, beacon, messages, ChatService, UtilsService, Beacon) {

  var msgRefresh;

  $scope.beacon = beacon;
  $scope.messages = messages.results;
  $scope.currentUser = UtilsService.getCurrentUser();

  var refreshMessages = function() {
    ChatService.list($scope.beacon.objectId).then(function(response) {
      $scope.messages = response.results;
    })
  };

  var timer = $interval(refreshMessages, 1500000);

  $scope.$on("$destroy", function() {
    if (timer) {
      $interval.cancel(timer);
    }
  });

  $scope.joinBeacon = function(beacon) {
    Beacon.updateFireteam(beacon, 'join').then(function() {
      $scope.myBeacon = beacon.objectId;
      $state.go('app.beacon', {
        beaconId: beacon.objectId
      }, {
        reload: true,
        notify: true
      });
    });
  }

  $scope.deleteBeacon = function(beacon) {
    var confirmDel = $ionicPopup.confirm({
      title: 'Delete beacon',
      template: 'Are you sure you want to delete your beacon?'
    });
    confirmDel.then(function(res) {
      if (res) {
        Beacon.delete(beacon).then(function() {
          $scope.myBeacon = null;
          $state.go('app.beacons', null, {
            reload: true,
            notify: true
          });
        });
      }
    });
  }

  $scope.sendMessage = function() {
    var msg = this.newMessage;
      this.newMessage = null; // clear the text entry box
      ChatService.save(msg, $scope.beacon.objectId).then(function(response) {

        // add a new item to the messages list (this will get replaced with the proper version on refresh)
        $scope.messages.unshift({
          objectId: response.objectId,
          createdAt: response.createdAt,
          message: msg,
          from: $scope.currentUser
        })
      })
    }

    $scope.guardianAction = function(object) {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Kick guardian',
        cancelText: 'Cancel',
        cancel: function() {
          hideSheet();
        },
        destructiveButtonClicked: function() {
          Beacon.updateFireteam(object, 'kick')
          return true;
        }
      });

    };

  }
])

.controller('CreateBeaconController', ['$scope', '$rootScope', '$state', 'missions', 'platforms', 'regions', 'mics', 'Beacon', 'UtilsService', '$ionicSlideBoxDelegate', '$timeout', function($scope, $rootScope, $state, missions, platforms, regions, mics, Beacon, UtilsService, $ionicSlideBoxDelegate, $timeout) {

  // Called when the form is submitted
  $scope.createBeacon = function() {
    var hasLevel = $scope.levels ? $scope.levels.length > 0 : false,
      hasCheckpoint = $scope.checkpoints ? $scope.checkpoints.length > 0 : false;

    Beacon.save({
      'mission': UtilsService.getObjectAsPointer('missions', $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()].objectId),
      'checkpoint': hasCheckpoint ? UtilsService.getObjectAsPointer('checkpoints', $scope.checkpoints[$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').currentIndex()].objectId) : null,
      'mic': UtilsService.getObjectAsPointer('mics', $scope.mics[$ionicSlideBoxDelegate.$getByHandle('mic-selector').currentIndex()].objectId),
      'level': hasLevel ? UtilsService.getObjectAsPointer('levels', $scope.levels[$ionicSlideBoxDelegate.$getByHandle('level-selector').currentIndex()].objectId) : null,
      'fireteamRequired': $ionicSlideBoxDelegate.$getByHandle('fireteam-selector').currentIndex() + 1,
      'fireteamOnboard': [UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.objectId)],
      'platform': UtilsService.getObjectAsPointer('platforms', $scope.platforms[$ionicSlideBoxDelegate.$getByHandle('platform-selector').currentIndex()].objectId),
      'region': UtilsService.getObjectAsPointer('regions', $scope.regions[$ionicSlideBoxDelegate.$getByHandle('region-selector').currentIndex()].objectId),
      'creator': UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.objectId),
      'active': true
    }).then(function(response) {
      $state.go('app.beacons', null, {
        reload: true,
        notify: true
      });
    })
  };

  $scope.$watch('levels', function() {
    $ionicSlideBoxDelegate.$getByHandle('level-selector').slide(0, 100);
    $ionicSlideBoxDelegate.$getByHandle('level-selector').update();
  });

  $scope.$watch('checkpoints', function() {
    $ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').slide(0, 100);
    $ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').update();
  });

  $scope.$watch('maxFireteam', function() {
    $ionicSlideBoxDelegate.$getByHandle('fireteam-selector').slide(0, 100);
    $ionicSlideBoxDelegate.$getByHandle('fireteam-selector').update();
  });

  $scope.updateMission = function(index) {
    var mission = $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()]
    var levels = mission.levels;
    var checkpoints = mission.checkpoints;
    $scope.levels = levels ? levels : [];
    $scope.checkpoints = checkpoints ? checkpoints : [];
    $scope.maxFireteam = $scope.getMaxFireTeam(mission)
  }

  $scope.getMaxFireTeam = function(mission) {
    return _.range(1, mission.maxFireteam)
  }


  // define all the starting variables for the view
  $scope.missions = missions.results;
  $scope.platforms = platforms.results;
  $scope.regions = regions.results;
  $scope.checkpoints = $scope.missions[0].checkpoints ? $scope.missions[0].checkpoints : null;
  $scope.mics = mics.results;
  $scope.levels = $scope.missions[0].levels ? $scope.missions[0].levels : null;
  $scope.maxFireteam = $scope.getMaxFireTeam($scope.missions[0]);

  // set the starting slides for the platform and region
  $scope.defaultPlatform = _.findIndex($scope.platforms, {
    objectId: $rootScope.currentUser.platform.objectId
  })
  $scope.defaultRegion = _.findIndex($scope.regions, {
    objectId: $rootScope.currentUser.region.objectId
  })

  $ionicSlideBoxDelegate.update();

}])


.controller('DonateController', ['$rootScope', '$scope', function($rootScope, $scope) {
}])

.controller('FeedbackController', ['$rootScope', '$scope', function($rootScope, $scope) {

  $scope.feedback = {
    user : $rootScope.currentUser,
    message : ''
  }

  $scope.submitFeedback = function( feedback ) {
    FeedbackService.submit($scope.feedback.message).then(function() {
      if (response && response.$resolved) {
        UIService.showAlert({
          title: 'Thanks!',
          template: 'Your feedback is really important and we appreciate you taking the time to tell us what you think of the app.'
        }, function() {
          $state.go('login')
        })
      } else {
        UIService.showAlert({
          title: 'Failed!',
          template: 'Looks like there was a problem sbumitting your form. Please try again.'
        })
      }

    })
  }

}])

.controller('TutorialCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

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
