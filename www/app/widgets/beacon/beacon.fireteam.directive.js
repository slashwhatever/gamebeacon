(function() {
	"user strict";

	angular
		.module('gamebeacon.widgets')
		.directive('fireteam', fireteam)

	fireteam.$inject = ['Utils', '$ionicActionSheet', 'PUser'];

	function fireteam(Utils, $ionicActionSheet, PUser) {

		var directive = {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/widgets/beacon/beacon.fireteam.html',
			scope: {
				fireteam: '=',
				beacon: '='
			},
			link: link
		}

		return directive;

		function link(scope, elem, attrs) {

			var	userIsCreator = scope.beacon.userIsCreator,
				userOnboard = Utils.userOnboard(scope.beacon),
				beaconActive = scope.beacon.timeLeft > 0,
				hasSpaces = scope.beacon.fireteamSpaces > 0;

			scope.allowJoin = beaconActive && hasSpaces && (!userIsCreator && !userOnboard)

			scope.getFollowBtnCls = function(objectId) {
				var classes = [];
				if ( userIsCreator ) return 'hide';
				return isFriend(objectId) ? 'button-energized ion-checkmark-round' : 'button-balanced ion-plus-round button-outline'
			}

			scope.getBtnLbl = function(objectId) {
				return isFriend(objectId) ? 'following' : 'follow'
			}

			scope.toggleFollow = function(opts) {

				var friend = isFriend(opts.objectId);

				PUser.updateFriends(JSON.parse('{"__op":"' + (friend ? 'Remove' : 'AddUnique') + '","objects":[' + JSON.stringify(Utils.getObjectAsPointer('pusers', opts.objectId)) + ']}'));

			};

			scope.guardianAction = function(opts) {

				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					destructiveText: 'Kick guardian',
					cancelText: 'Cancel',
					cancel: function() {
						hideSheet();
					},

					destructiveButtonClicked: function() {
						Beacon.updateFireteam(opts.beacon, 'kick', opts.objectId)
						return true;
					}
				});

			};

			function isFriend(objectId) {
				var currentUser = PUser.getCurrentUser(),
					friends = _.map(currentUser.friends, function(f) {return f.objectId});
				return _.contains(friends, objectId);
			}

		}
	}

})();
