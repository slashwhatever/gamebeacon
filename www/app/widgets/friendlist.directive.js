(function() {

	"use strict";

	angular
		.module('gamebeacon.widgets')
		.directive('friendList', friendList)

	friendList.$inject = ['PUser', 'Utils'];

	function friendList(PUser, Utils) {

		var directive = {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/widgets/friendlist.html',
			link: link
		};

		return directive;

		function link(scope, elem, attrs) {

			var	currentUser = PUser.getCurrentUser();

			scope.currentUser = currentUser;

			scope.getFollowBtnCls = function(objectId) {
				var classes = [];
				return isFriend(objectId) ? 'button-energized ion-checkmark-round' : 'button-balanced ion-plus-round button-outline'
			}

			scope.getBtnLbl = function(objectId) {
				return isFriend(objectId) ? 'following' : 'follow'
			}

			scope.toggleFollow = function(opts) {

				var friend = isFriend(opts.objectId);

				PUser.updateFriends(JSON.parse('{"__op":"' + (friend ? 'Remove' : 'AddUnique') + '","objects":[' + JSON.stringify(Utils.getObjectAsPointer('pusers', opts.objectId)) + ']}'));

			};

			function isFriend(objectId) {
				var currentUser = PUser.getCurrentUser(),
					friends = _.map(currentUser.friends, function(f) {return f.objectId});
				return _.contains(friends, objectId);
			}


		}
	}
})();
